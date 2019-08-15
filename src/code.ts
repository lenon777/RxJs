import { of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap, catchError } from 'rxjs/operators';
import { from } from 'rxjs';
function sequence(amount: number): void {
    let i = 1;
    nextFetch();
    function nextFetch() {
        let rez = '';
        let data$ = fromFetch(`https://jsonplaceholder.typicode.com/users/${i}`).pipe(
            switchMap(response => {
                if (response.ok) {

                    return response.json();
                } else {
                    return of({ error: true, message: `Error ${response.status}` });
                }
            }),
            catchError(err => {
                console.error(err);
                return of({ error: true, message: err.message })
            })
        );
        i++;
        data$.subscribe({
            next: result => {
                console.log(result)
                rez = result.name;
            },
            complete: () => {
                const ul = document.getElementById('output');
                const li = document.createElement("li");
                li.innerText = rez;
                ul.append(li);
                if (i <= amount) nextFetch();
            }
        })
    }
}

function parallel(amount: number): void {
    let rez = '';
    const arrayOfUsersURL = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    arrayOfUsersURL.subscribe(
    function qwe(i: number) {
        const data$ = fromFetch(`https://jsonplaceholder.typicode.com/users/${i}`).pipe(
            switchMap(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return of({ error: true, message: `Error ${response.status}` });
                }
            }),
            catchError(err => {
                console.error(err);
                return of({ error: true, message: err.message })
            })
        )

        data$.subscribe({
            next: result => {
                rez = result.name;
                console.log(result)
            },
            complete: () => {
                const ul = document.getElementById('output');
                const li = document.createElement("li");
                li.innerText = rez;
                ul.append(li);
                console.log('done');
            }
        })
    })

}

function sequenceWithTime(amount: number): void {
    let i = 1;
    nextFetch(0);
    function nextFetch(delay: number) {
        let rez = '';
        let data$ = fromFetch(`https://jsonplaceholder.typicode.com/users/${i}`).pipe(
            switchMap(response => {
                if (response.ok && delay <= 4000) {

                    return response.json();
                } else {
                    return of({ error: true, message: `Error ${response.status}` });
                }
            }),
            catchError(err => {
                console.error(err);
                return of({ error: true, message: err.message })
            })
        );
        i++;
        data$.subscribe({
            next: result => {
                console.log(result)
                rez = result.name;
            },
            complete: () => {
                const delay = Math.random() * (5000 - 1000) + 1000;
                const ul = document.getElementById('output');
                const li = document.createElement("li");
                if (rez !== undefined && i <= amount) {
                    setTimeout(() => { nextFetch(delay) }, delay)
                } else {
                    rez = "Too much time"
                    li.classList.add("warning");
                }

                li.innerText = rez;
                ul.append(li);
            }
        })
    }
}


function sequenceWithTimeAndContinue(amount: number): void {
    let i = 1;
    nextFetch(0);
    function nextFetch(delay: number) {
        let rez = '';
        let data$ = fromFetch(`https://jsonplaceholder.typicode.com/users/${i}`).pipe(
            switchMap(response => {
                if (response.ok && delay <= 4000) {

                    return response.json();
                } else {
                    return of({ error: true, message: `Error ${response.status}` });
                }
            }),
            catchError(err => {
                console.error(err);
                return of({ error: true, message: err.message })
            })
        );
        i++;
        data$.subscribe({
            next: result => {
                console.log(result)
                rez = result.name;
            },
            complete: () => {
                const delay = Math.random() * (5000 - 1000) + 1000;
                const ul = document.getElementById('output');
                const li = document.createElement("li");
                if (i <= amount) {
                    if (rez !== undefined) {
                        setTimeout(() => { nextFetch(delay) }, delay)
                    } else {
                        rez = "Too much time, Press the button if you want to continue fetching"

                        li.classList.add("warning");
                        const btn = document.createElement("button");
                        btn.innerText = "Continue";
                        document.getElementsByTagName('body')[0].append(btn);
                        btn.addEventListener('click', () => {
                            nextFetch(0),
                                btn.remove();
                        })

                    }
                    li.innerText = rez;
                    ul.append(li);
                }
            }
        })
    }
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
    sequenceWithTime(10);
});

function clearList() {
    const myNode = document.getElementById("output");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}