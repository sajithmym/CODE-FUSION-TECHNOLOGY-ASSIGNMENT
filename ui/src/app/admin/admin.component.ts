import { Component, OnInit } from '@angular/core';
import { AuthService } from './service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  courses: any[] = [];
  showPopup: boolean = true;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.authService.getApplications().subscribe(
      (data: any[]) => {
        this.courses = data;
      },
      (error: any) => {
        console.error('Error fetching applications', error);
      }
    );
  }

  editCourse(course: any) {
    console.log('Edit course', course);
  }

  deleteCourse(course: any) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.authService.deleteApplication(course.id).subscribe(
        () => {
          this.loadApplications();
        },
        (error: any) => {
          console.error('Error deleting course', error);
        }
      );
    }
  }

  viewPicture(event: Event, course: any) {
    event.preventDefault(); // Prevent the default action of the anchor tag
    this.authService.getPicture(course.id).subscribe(
      (response: HttpResponse<Blob>) => {
        if (response && response.body && response.headers) {
          const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
          const blob = new Blob([response.body], { type: contentType });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          const contentDisposition = response.headers.get('Content-Disposition');
          const fileName = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'download.jpg';
          a.href = url;
          a.download = fileName; // Extract file name from headers
          document.body.appendChild(a); // Append the anchor to the body
          a.click(); // Trigger the download
          document.body.removeChild(a); // Remove the anchor from the body
          window.URL.revokeObjectURL(url); // Clean up the URL object
        } else {
          console.error('Invalid response structure', response);
        }
      },
      (error: any) => {
        console.error('Error fetching picture', error);
      }
    );
  }

  closePopup() {
    this.showPopup = false;
  }

  submitPassword(password: string) {
    this.authService.authenticate(password).subscribe(
      (response: any) => {
        if (response.success) {
          this.showPopup = false;
        } else {
          alert('Incorrect password');
        }
      },
      (error: any) => {
        alert('Error verifying password');
      }
    );
  }
}