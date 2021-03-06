import { of, range, throwError,timer } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {catchError, flatMap, concatMap, delay, retryWhen, tap, delayWhen } from 'rxjs/operators';

import { drag } from './DandD';
drag()

function sequence(amount: number): void {
    range(1, amount).pipe(
        concatMap(i => {
            return fromFetch(`https://jsonplaceholder.typicode.com/users/${i}`).pipe(
                flatMap(i => {
                    return i.json();
                })
            )
        })
    ).subscribe({
        next: x => {
            console.log(x)
            const ul = document.getElementById('output');
            const li = document.createElement("li");
            li.innerText = x.name;
            ul.append(li);
        }
    });
}

function parallel(amount: number): void {
    range(1, amount).pipe(
        flatMap(i => {
            return fromFetch(`https://jsonplaceholder.typicode.com/users/${i}`).pipe(
                flatMap(i => {
                    return i.json();
                })
            )
        })
    ).subscribe({
        next: x => {
            console.log(x)
            const ul = document.getElementById('output');
            const li = document.createElement("li");
            li.innerText = x.name;
            ul.append(li);
        }
    });
}

function sequenceWithTime(amount: number): void {

    range(1, amount).pipe(concatMap(i => {
        const delayTime = Math.random() * (5000 - 1000) + 1000;
        return fromFetch(`https://jsonplaceholder.typicode.com/users/${i}`).pipe(
            delay(delayTime),
            flatMap(i => {
                if (delayTime > 4000) {

                    return throwError('Too much time');
                }
                return i.json();
            })
        )
    })
    ).subscribe({
        next: x => {
            console.log(x)
            const ul = document.getElementById('output');
            const li = document.createElement("li");
            li.innerText = x.name;
            ul.append(li);
        },
        error: e => {
            const ul = document.getElementById('output');
            const li = document.createElement("li");
            li.innerText = e;
            ul.append(li);
            li.classList.add("warning");
        }
    })
}
function sequenceWithTimeAndContinue(amount: number): void {
    range(1, amount).pipe(concatMap(i => {
        const delayTime = Math.random() * (5000 - 1000) + 1000;
        return fromFetch(`https://jsonplaceholder.typicode.com/users/${i}`).pipe(
            delay(delayTime),
            flatMap(x => {
                if (delayTime > 4000) {
                    delay(500000000)
                    return throwError('Too much time')
                }
                return x.json()
            }),
            retryWhen(errors =>
                errors.pipe(
                  
                )
              
            )
        )
    })).subscribe({
        next: x => {
            console.log(x);
            const ul = document.getElementById('output');
            const li = document.createElement("li");
            li.innerText = x.name;
            ul.append(li);
        },
        error: e => {
            const ul = document.getElementById('output');
            const li = document.createElement("li");
            li.innerText = e;
            ul.append(li);
            li.classList.add('warning');
            const btn = document.createElement("button");
            btn.innerText = "Continue";
            document.getElementsByTagName('li')[ document.getElementsByTagName('li').length-1].append(btn);
            btn.addEventListener('click', () => {
                
                btn.remove();
            })
        },
        complete: ()=>{
            console.log("Finish")
        }
    })
}

document.getElementById('sequenceWithTimeAndContinue').addEventListener('click', () => {
    clearList();
    sequenceWithTimeAndContinue(10)
});
document.getElementById('sequence').addEventListener('click', () => {
    clearList();
    sequence(10);
});
document.getElementById('parallel').addEventListener('click', () => {
    clearList();
    parallel(10);
});
document.getElementById('sequenceWithTime').addEventListener('click', () => {
    clearList();
    sequenceWithTime(5);
});

function clearList() {
    const myNode = document.getElementById("output");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}
