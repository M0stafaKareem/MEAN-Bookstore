import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthorService } from '../../../services/author.service';
import { CategoryService } from '../../../services/category.service';
import { Author } from '../../../models/author.model';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-books-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './books-form.component.html',
  styleUrl: './books-form.component.css',
})
export class BooksFormComponent {
  @Input() book: Book = {
    _id: '',
    author: '',
    category: '',
    name: '',
    photo: '',
  };
  @Input() formActionType: string = 'Add';

  categoryList: Category[] = [];
  authorList: Author[] = [];

  bookName = new FormControl('');
  bookAuthor = new FormControl('');
  bookCategory = new FormControl('');
  bookPhoto = new FormControl('');

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.bookName.setValue(this.book.name!);
    this.bookAuthor.setValue(this.book.author! || 'Select Author');
    this.bookCategory.setValue(this.book.category! || 'Select Category');
    this.bookPhoto.setValue(this.book.photo!);
    this.getAuthorsList();
    this.getCategoriesList();
  }

  getAuthorsList() {
    return this.authorService.getAuthors().subscribe((response) => {
      this.authorList = response.data.authors;
      console.log(this.authorList);
    });
  }
  getCategoriesList() {
    return this.categoryService.getCategories(1, 100).subscribe((response) => {
      this.categoryList = response.data;
    });
  }

  insertBook(book: Book): void {
    this.bookService.addBook(book).subscribe((data: any) => {
      console.log(data.status);
    });
  }

  updateBook(bookId: string, updatingData: {}): void {
    this.bookService.updateBook(bookId, updatingData).subscribe((data: any) => {
      console.log(data.status);
    });
  }
  deleteBook(bookId?: string): void {
    this.bookService.deleteBook(bookId).subscribe((data: any) => {
      console.log(data.status);
    });
  }

  formSubmitHandler(event: Event): void {
    event.preventDefault();
    const formData: Book = {
      name: this.bookName.value!,
      author: this.bookAuthor.value!,
      category: this.bookCategory.value!,
      photo: this.bookPhoto.value!,
      authorId: this.authorList.find(
        (item) => item.firstName + ' ' + item.lastName == this.bookAuthor.value
      )?._id,
      categoryId: this.categoryList.find(
        (item) => item.name == this.bookCategory.value
      )?._id,
    };

    if (this.formActionType === 'Add') {
      this.insertBook(formData);
    } else if (this.formActionType === 'Update') {
      this.updateBook(this.book._id!, formData);
    } else if (this.formActionType === 'Delete') {
      this.deleteBook(this.book._id);
    }
    location.reload();
  }
}
