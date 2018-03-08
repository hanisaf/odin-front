//https://github.com/angular/material2/issues/2315
import {Component, Output, EventEmitter, ViewChild, ElementRef, Input} from '@angular/core';

@Component({
    'moduleId': module.id,
    'selector': 'input-file',
    'template': `
        <span align="center">
        <input [accept]="accept" type="file" (change)="onNativeInputFileSelect($event)" #inputFile hidden />
        <button mat-menu-item (click)="selectFile()">
            <ng-content *ngIf="!fileCount" select=".nofiles"></ng-content>
            <span *ngIf="fileCount">
                <span></span>
                <ng-content select=".selected"></ng-content>
            </span>
        </button>
    </span>
    `
})
export class InputFile {
    @Input() accept: string;
    @Output() onFileSelect: EventEmitter<File[]> = new EventEmitter();

    @ViewChild('inputFile') nativeInputFile: ElementRef;

    _files: File[];

    get fileCount(): number { return this._files && this._files.length || 0; }

    onNativeInputFileSelect($event) {
        this._files = $event.srcElement.files;
        this.onFileSelect.emit(this._files);
    }

    selectFile() {
        this.nativeInputFile.nativeElement.click();
    }
}
