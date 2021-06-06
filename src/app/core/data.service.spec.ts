import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController, TestRequest } from "@angular/common/http/testing";

import { DataService } from "./data.service";
import { Book } from "app/models/book";
import { BookTrackerError } from "app/models/bookTrackerError";

describe("DataService Tests", () => {

    let dataService:DataService;
    let httpTestingController:HttpTestingController;
    let testBooks: Book[] = [
        { bookID:1, title:"First", author:"author1", publicationYear:2001 },
        { bookID:2, title:"Second", author:"author2", publicationYear:2002 },
        { bookID:3, title:"Third", author:"author3", publicationYear:2003 },
    ];

    beforeEach(()=> {

        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [ DataService ]
        });

        //dataService = TestBed.get(DataService);
        //httpTestingController = TestBed.get(HttpTestingController);
        dataService = TestBed.inject(DataService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(()=>{
        httpTestingController.verify();
    });

    it("Should GET all Books", ()=>{
        dataService.getAllBooks()
        .subscribe((data: Book[] | BookTrackerError) => {
            
             if(data instanceof BookTrackerError){
                console.log(`Dashboard Component Eror: ${data.friendlyMessage}`);
              }
              else{
                expect(data.length).toBe(3);
              }
           
        });

        let bookRequest:TestRequest = httpTestingController.expectOne("/api/books");
        expect(bookRequest.request.method).toEqual("GET");

        bookRequest.flush(testBooks);

       
    });

    it("Should give error BookTrackerError", ()=> {
        dataService.getAllBooks()
        .subscribe(
            (data:Book[] | BookTrackerError) =>{ fail("this should give bookTrackerError"); },
            (err:BookTrackerError) => {
                expect(err.errorNumber).toEqual(100);
                expect(err.friendlyMessage).toEqual("An error occurred when retrieving data");
            }
            );
        let bookRequest:TestRequest = httpTestingController.expectOne("/api/books");
        bookRequest.flush("error",{
            status:500,
            statusText:"Internal Server Error"
        });
    });
});