import { fromEvent } from 'rxjs';
import { takeUntil, flatMap } from 'rxjs/operators';

const div = document.getElementById('div');
const takeSquare$ = fromEvent(div, 'mousedown');
const putSquare$ = fromEvent(document, 'mouseup');
const moveSquare$ = fromEvent(document, 'mousemove');

const dot = document.getElementById('dot');
const takeDot$ = fromEvent(dot, 'mousedown');
const putDot$ = fromEvent(dot, 'mouseup');
const moveDot$ = fromEvent(document, 'mousemove');

export function drag() {
    takeSquare$.pipe(
        flatMap(_ => {
            return moveSquare$.pipe(
                takeUntil(putSquare$),
            )
        })
    ).subscribe({
        next: (e: any) => {
            div.style.position = 'absolute';
            div.style.top = e.clientY - 100 + "px";
            div.style.left = e.clientX -100 + "px";
        }
    });

    takeDot$.pipe(
        flatMap(()=>{
            return moveDot$.pipe(
                takeUntil(putDot$)
            )
        })
    ).subscribe({
        next: (e: any) => {
            dot.style.position = 'absolute';
            dot.style.top = e.clientY - 100 + "px";
            dot.style.left = e.clientX -100 + "px";
        }
    })


}
