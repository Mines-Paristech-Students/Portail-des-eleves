import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

export abstract class AbstractWidget  {


  constructor(protected _apiService: ApiService) { }

}
