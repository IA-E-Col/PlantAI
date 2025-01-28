import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.css']
})
export class CommentDialogComponent {
  comments: any[];
  cheminUser = "assets/user.png";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('Received comments:', data.comments);
    this.comments = data.comments.map((comment: { commentaire: any; }) => ({
      ...comment,
      isEditing: false,
      editedComment: comment.commentaire
    }));
  }

  toggleEditMode(comment: any) {
    comment.isEditing = !comment.isEditing;
    if (!comment.isEditing) {
      comment.editedComment = comment.commentaire; // Reset edited comment if canceling
    }
  }

  updateComment(comment: any) {
    if (comment.editedComment.trim()) {
      comment.commentaire = comment.editedComment;
      comment.isEditing = false;
      // Ajoutez ici votre logique pour sauvegarder le commentaire mis à jour
      /*
      *
      *
      *
      *
      *
      *
      *
      *
      *
      *
      *
      */
    }
  }
}
