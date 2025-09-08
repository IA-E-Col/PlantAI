export interface NavigationState {
  // Current active menu and submenu
  activeMenu: string;
  activeSubmenu: string;
  
  // Current route information
  currentRoute: string;
  
  // Current item IDs for dynamic menu generation
  currentProjectId: string | null;
  currentCollectionId: string | null;
  currentDatasetId: string | null;
  currentModelId: string | null;
  currentClassId: string | null;
  
  // Sidebar state
  sidebarOpen: boolean;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

export interface MenuItem {
  name: string;
  icon: any; // FontAwesome icon
  path: string;
}

export interface SubmenuItem {
  name: string;
  icon: any; // FontAwesome icon
  path: string;
}

export interface MenuItems {
  [key: string]: SubmenuItem[];
}

export const initialNavigationState: NavigationState = {
  activeMenu: 'Projects',
  activeSubmenu: '',
  currentRoute: '',
  currentProjectId: null,
  currentCollectionId: null,
  currentDatasetId: null,
  currentModelId: null,
  currentClassId: null,
  sidebarOpen: true,
  isLoading: false,
  error: null,
};
