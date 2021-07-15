import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Car } from 'src/app/models/entities/car';
import { CarService } from '../../services/car.service';
import { Brand } from 'src/app/models/entities/brand';
import { BrandService } from '../../services/brand.service';
import { Color } from 'src/app/models/entities/color';
import { ColorService } from '../../services/color.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-car-add',
  templateUrl: './car-add.component.html',
  styleUrls: ['./car-add.component.css']
})
export class CarAddComponent implements OnInit {

  brands:Brand[];
  colors:Color[];
  carAddForm:FormGroup;
  carImage:String;
  name="Angular";
  @ViewChild('carImage2') private draggableElement: ElementRef;
  @ViewChild('carImage') private draggableElement2: ElementRef;

  constructor(private carService:CarService,
              private brandService:BrandService,
              private colorService:ColorService,
              private toastrService:ToastrService,
              private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.createCarAddForm();
    this.getBrands();
    this.getColors();
  }

  getBrands(){
    this.brandService.getBrands().subscribe(response => {
      this.brands = response.data;
    })
  }

  getColors(){
    this.colorService.getColors().subscribe(response => {
      this.colors = response.data;
    })
  }

  createCarAddForm(){
    this.carAddForm=this.formBuilder.group({
      brandId:["",Validators.required],
      colorId:["",Validators.required],
      carName:["",Validators.required],
      dailyPrice:["",Validators.required],
      modelYear:["",Validators.required],
      description:["",Validators.required],
      carImage:["",Validators.required]
    })
  }
  onFileSelected(event:any) {

    if(event.target.files.length > 0)
     {
     //console.log(event.target.files[0].name);
     this.carImage=event.target.files[0].name;
    }
    this.carAddForm.controls['carImage'].setValue("assets/image/"+this.carImage);
    //this.carAddForm.removeControl('carImage2');
    //this.carAddForm.addControl('carImage2',new FormControl(this.carImage,Validators.required))
    console.log(this.carAddForm);
    //return this.carImage.replace(/^.*[\\\/]/, '');
    return false;
   }

  addCar(){
    //this.carAddForm.controls['carImage'].setValue(this.carImage);
    //console.log(this.carAddForm.controls['carImage']);
    this.draggableElement.nativeElement.remove();
    this.draggableElement2.nativeElement.style.display="block";

    if(this.carAddForm.valid){

      let carModel = Object.assign({},this.carAddForm.value);
      this.carService.addCar(carModel).subscribe(
        response => {

        this.toastrService.success(response.message,"Successful")
        },
        responseError => {
        if(responseError.error.ValidationErrors.length > 0) {
          for(let i=0;i<responseError.error.ValidationErrors.length;i++) {
            this.toastrService.error(responseError.error.ValidationErrors[i].ErrorMessage,"Validation Error")
            console.log(responseError);
          }
        }
      })
    }
    else {
      this.toastrService.error("The form is missing.","Attention!")
    }
  }
}


