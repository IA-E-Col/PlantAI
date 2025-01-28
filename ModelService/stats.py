from flask import Flask, request, jsonify, send_file
import numpy as np
from ultralytics import YOLO
import cv2
from skimage.feature import hog
from skimage.filters import gabor
import matplotlib.pyplot as plt
from PIL import Image
import torch
import torchvision.transforms as transforms
import os

app = Flask(__name__)

def load_yolo_model(model_path):
    """
    Charge le modèle YOLO à partir du chemin spécifié.
    """
    return YOLO(model_path)

def load_image(image_path, resize=(640, 640)):
    """
    Charge et prétraite une image à partir du chemin spécifié.
    """
    img = Image.open(image_path)
    transform = transforms.Compose([
        transforms.Resize(resize),
        transforms.ToTensor()
    ])
    return transform(img).unsqueeze(0)

def get_conv_layers(model):
    """
    Récupère les couches de convolution du modèle donné.
    """
    return [(name, module) for name, module in model.model.named_modules() if isinstance(module, torch.nn.Conv2d)]

def get_activation(layer, input_tensor, model):
    """
    Obtient les activations d'une couche pour un tenseur d'entrée donné.
    """
    activation = []
    def hook_fn(module, input, output):
        activation.append(output)
    handle = layer.register_forward_hook(hook_fn)
    model.model(input_tensor)
    handle.remove()
    return activation[0]

def generate_heatmap(img_tensor, model, conv_layer):
    """
    Génère une carte de chaleur pour une couche de convolution spécifiée.
    """
    activations = get_activation(conv_layer, img_tensor, model)
    heatmap = torch.mean(activations, dim=1).squeeze().cpu().detach().numpy()
    heatmap = np.maximum(heatmap, 0)
    if np.max(heatmap) != 0:
        heatmap /= np.max(heatmap)
        heatmap = np.uint8(255 * heatmap)
    else:
        return heatmap

    heatmap = cv2.resize(heatmap, (img_tensor.shape[3], img_tensor.shape[2]))
    return heatmap

def overlay_heatmap_on_image(image_path, heatmap, alpha=0.6):
    """
    Superpose une carte de chaleur sur une image.
    """
    img = cv2.imread(image_path)
    heatmap_resized = cv2.resize(heatmap, (img.shape[1], img.shape[0])).astype(np.uint8)
    heatmap_color = cv2.applyColorMap(heatmap_resized, cv2.COLORMAP_JET)
    return cv2.addWeighted(img, 1-alpha, heatmap_color, alpha, 0)

def visualize_last_conv_layer_heatmap(image_path, model_path):
    """
    Visualise la carte de chaleur générée par la dernière couche de convolution.
    """
    model = load_yolo_model(model_path)
    img_tensor = load_image(image_path)
    conv_layers = get_conv_layers(model)
    img = Image.open(image_path)

    if conv_layers:
        last_conv_layer = conv_layers[-1][1]
        heatmap = generate_heatmap(img_tensor, model, last_conv_layer)
        superimposed_img = overlay_heatmap_on_image(image_path, heatmap)

        fig, axes = plt.subplots(1, 2, figsize=(7, 5), sharey=True)
        axes[0].imshow(superimposed_img)
        axes[0].set_title('Last Conv Layer Heatmap')
        axes[1].imshow(img)
        axes[1].set_title('Original Image')
        plt.savefig("last_conv_layer_heatmap.png")
        plt.show()
    else:
        print("No convolutional layers found in the model.")

################################# Fonctions des statistiques #####################################
def histogram_of_gradients(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    hog_features = hog(gray_image, pixels_per_cell=(8, 8), cells_per_block=(2, 2), visualize=False)
    return hog_features

def histogram_of_textures(gray_image):
    filt_real, filt_imag = gabor(gray_image, frequency=0.6)
    return filt_real, filt_imag

def color_standard_deviation(image):
    std_red = np.std(image[:, :, 0])
    std_green = np.std(image[:, :, 1])
    std_blue = np.std(image[:, :, 2])
    return std_red, std_green, std_blue

def contrast(gray_image):
    contrast = np.std(gray_image)
    return contrast

def mean_brightness(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    mean_brightness = np.mean(gray_image)
    return mean_brightness

def color_histogram(image):
    hist_red = cv2.calcHist([image], [0], None, [256], [0, 256])
    hist_green = cv2.calcHist([image], [1], None, [256], [0, 256])
    hist_blue = cv2.calcHist([image], [2], None, [256], [0, 256])
    return hist_red, hist_green, hist_blue

def mean_and_variance(image):
    mean_red = np.mean(image[:, :, 0])
    var_red = np.var(image[:, :, 0])
    mean_green = np.mean(image[:, :, 1])
    var_green = np.var(image[:, :, 1])
    mean_blue = np.mean(image[:, :, 2])
    var_blue = np.var(image[:, :, 2])
    return mean_red, var_red, mean_green, var_green, mean_blue, var_blue

def plot_hog_histogram(hog_features):
    plt.figure()
    plt.hist(hog_features, bins=20)
    plt.title('Histogramme des gradients (HOG)')
    plt.xlabel('Valeur du descripteur')
    plt.ylabel('Fréquence')
    plt.savefig("hog_histogram.png")

def plot_gabor_filters(filt_real, filt_imag):
    fig, axes = plt.subplots(1, 2, figsize=(7, 5), sharey=True)
    #fig.subplots_adjust(hspace=0.5)  #Augmenter l'espace vertical entre les sous-graphiques
    axes[0].imshow(filt_real, cmap='gray')
    axes[0].set_title('Partie réelle du filtre de Gabor')
    axes[1].imshow(filt_imag, cmap='gray')
    axes[1].set_title('Partie imaginaire du filtre de Gabor')
    plt.savefig("gabor_filters_histogram.png")

def plot_color_standard_deviation(std_red, std_green, std_blue):
    colors = ['Rouge', 'Vert', 'Bleu']
    std_values = [std_red, std_green, std_blue]
    plt.figure()
    plt.bar(colors, std_values, color=['red', 'green', 'blue'])
    plt.title('Écart-Type des Couleurs')
    plt.xlabel('Canal de couleur')
    plt.ylabel('Écart-type')
    plt.savefig("color_standard_deviation_histogram.png")

def plot_contrast_histogram(gray_image):
    # Calculer le contraste
    contrast = np.std(gray_image)

    # Afficher l'histogramme de contraste
    plt.figure(figsize=(5, 5))
    plt.hist(gray_image.ravel(), bins=256, color='gray')
    plt.axvline(x=contrast, color='b', linestyle='dashed', linewidth=1)
    plt.title('Histogramme de contraste')
    plt.xlabel('Intensité')
    plt.ylabel('Nombre de pixels')
    plt.legend(['Contraste moyenne'])
    plt.tight_layout()
    plt.savefig("contrast_histogram.png")

def plot_brightness_histogram(gray_image):
    # Calculer la luminosité moyenne
    mean_brightness = np.mean(gray_image)

    # Afficher l'histogramme de luminosité
    plt.figure(figsize=(5, 5))
    plt.hist(gray_image.ravel(), bins=256, color='gray')
    plt.axvline(x=mean_brightness, color='r', linestyle='dashed', linewidth=1)
    plt.title('Histogramme de luminosité')
    plt.xlabel('Intensité')
    plt.ylabel('Nombre de pixels')
    plt.legend(['Luminosité moyenne'])
    plt.tight_layout()
    plt.savefig("brightness_histogram.png")

def plot_color_histogram(hist_red, hist_green, hist_blue):
    plt.figure()
    plt.subplot(3, 1, 1)
    plt.plot(hist_red, color='red')
    plt.title('Histogramme de couleur - Rouge')
    plt.xlabel('Intensité')
    plt.ylabel('Nombre de pixels')
    plt.subplot(3, 1, 2)
    plt.plot(hist_green, color='green')
    plt.title('Histogramme de couleur - Vert')
    plt.xlabel('Intensité')
    plt.ylabel('Nombre de pixels')
    plt.subplot(3, 1, 3)
    plt.plot(hist_blue, color='blue')
    plt.title('Histogramme de couleur - Bleu')
    plt.xlabel('Intensité')
    plt.ylabel('Nombre de pixels')
    plt.tight_layout()
    plt.savefig("color_histogram.png")

def plot_mean_histogram(mean_values):
    colors = ['Rouge', 'Vert', 'Bleu']
    colorss = ['red', 'green', 'blue']

    plt.figure(figsize=(5, 5))
    plt.bar(colors, mean_values, color=colorss)
    plt.title('Moyenne des valeurs de couleur')
    plt.xlabel('Canal de couleur')
    plt.ylabel('Moyenne')
    plt.tight_layout()
    plt.savefig("mean_histogram.png")

def plot_variance_histogram(var_values):
    colors = ['Rouge', 'Vert', 'Bleu']
    colorss = ['red', 'green', 'blue']

    plt.figure(figsize=(5, 5))
    plt.bar(colors, var_values, color=colorss)
    plt.title('Variance des valeurs de couleur')
    plt.xlabel('Canal de couleur')
    plt.ylabel('Variance')
    plt.tight_layout()
    plt.savefig("variance_histogram.png")

def supprimer_images(chemin_dossier):
    os.chdir(chemin_dossier)

    # Listez tous les fichiers dans le répertoire actuel
    fichiers = os.listdir()

    # Parcourez tous les fichiers
    for fichier in fichiers:
        if fichier.endswith(".png") or fichier.endswith(".jpg"):
            os.remove(fichier)
            print(f"Fichier supprimé : {fichier}")