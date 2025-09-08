import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, BehaviorSubject } from 'rxjs';

import { AppState } from '../../store/app.state';
import { selectUser } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-comment-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, AsyncPipe],
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.css']
})
export class CommentDialogComponent implements OnInit, OnDestroy {
  
  // UI State
  cheminUser = "assets/user.png";
  
  // NgRx Observables
  currentUser$: Observable<any>;
  
  // Local state management with reactive patterns
  private commentsSubject = new BehaviorSubject<any[]>([]);
  comments$: Observable<any[]> = this.commentsSubject.asObservable();
  
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CommentDialogComponent>,
    private store: Store<AppState>
  ) {
    // Initialize observables from NgRx store
    this.currentUser$ = this.store.select(selectUser);
    
    console.log('Received comments:', data.comments);
    
    // Process and store comments reactively
    const processedComments = (data.comments || []).map((comment: any) => ({
      ...comment,
      isEditing: false,
      editedComment: comment.commentaire,
      originalComment: comment.commentaire
    }));
    
    this.commentsSubject.next(processedComments);
  }

  ngOnInit(): void {
    // Subscribe to current user for any user-specific logic
    this.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          console.log('Comment dialog opened by user:', user.email);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleEditMode(comment: any): void {
    const currentComments = this.commentsSubject.value;
    const commentIndex = currentComments.findIndex(c => c.id === comment.id);
    
    if (commentIndex !== -1) {
      const updatedComments = [...currentComments];
      updatedComments[commentIndex] = {
        ...updatedComments[commentIndex],
        isEditing: !updatedComments[commentIndex].isEditing,
        editedComment: !updatedComments[commentIndex].isEditing 
          ? updatedComments[commentIndex].commentaire 
          : updatedComments[commentIndex].editedComment
      };
      
      this.commentsSubject.next(updatedComments);
      console.log('Toggled edit mode for comment:', comment.id);
    }
  }

  updateComment(comment: any): void {
    if (comment.editedComment && comment.editedComment.trim()) {
      const currentComments = this.commentsSubject.value;
      const commentIndex = currentComments.findIndex(c => c.id === comment.id);
      
      if (commentIndex !== -1) {
        const updatedComments = [...currentComments];
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          commentaire: comment.editedComment.trim(),
          isEditing: false,
          Edit: (updatedComments[commentIndex].Edit || 0) + 1,
          lastModified: new Date().toISOString()
        };
        
        this.commentsSubject.next(updatedComments);
        
        console.log('Updated comment with NgRx patterns:', {
          commentId: comment.id,
          newContent: comment.editedComment.trim(),
          editCount: updatedComments[commentIndex].Edit
        });
        
        // TODO: This is where we would dispatch an NgRx action to save the comment
        // Example: this.store.dispatch(CommentsActions.updateComment({ 
        //   commentId: comment.id, 
        //   content: comment.editedComment.trim() 
        // }));
        
        // For now, we'll show a success message
        this.showUpdateSuccess();
      }
    }
  }

  private showUpdateSuccess(): void {
    // Simple visual feedback - could be enhanced with a notification store
    console.log('Comment updated successfully!');
  }

  cancelEdit(comment: any): void {
    this.toggleEditMode(comment);
  }

  closeDialog(): void {
    // Return the updated comments to the parent component
    const finalComments = this.commentsSubject.value;
    this.dialogRef.close(finalComments);
  }

  trackByCommentId(index: number, comment: any): any {
    return comment.id || index;
  }
}
