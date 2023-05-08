import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";

export const slideInAnimation =
    trigger('routeAnimations', [
        transition('page => masterPasswordPage', [
            query(':enter, :leave', [
                style({
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100svw',
                    display: 'block'
                })
            ], { optional: true }),
            query(':enter', [style({ left: '-100%' })], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [animate('500ms ease-in-out', style({ left: '100%' }))]),
                query(':enter', [animate('500ms ease-in-out', style({ left: '0%' }))]),
            ]),
        ]),
        transition('masterPasswordPage => page', [
            query(':enter, :leave', [
                style({
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100svw',
                    display: 'block'
                })
            ], { optional: true }),
            query(':enter', [style({ left: '100%' })], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [animate('500ms ease-in-out', style({ left: '-100%' }))]),
                query(':enter', [animate('500ms ease-in-out', style({ left: '0%' }))]),
            ]),
        ])
    ]);
