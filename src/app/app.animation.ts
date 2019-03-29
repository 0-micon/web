import {
  trigger,
  AnimationMetadata,
  transition,
  query,
  style,
  group,
  animate
} from '@angular/animations';

const enterMetadata: AnimationMetadata[] = [
  style({ transform: 'translateX(100%)' }),
  animate('0.5s ease-out', style({ transform: 'translateX(0%)' }))
];

const leaveMetadata: AnimationMetadata[] = [
  style({ transform: 'translateX(0%)' }),
  animate('0.5s ease-out', style({ transform: 'translateX(-100%)' }))
];

const animationMetadata: AnimationMetadata[] = [
  // Events to apply
  // Defined style and animation function to apply
  // Config object with optional set to true to handle when element not yet added to the DOM
  query(':enter, :leave', style({ position: 'fixed', width: '100%', zIndex: 2 }), {
    optional: true
  }),
  // group block executes in parallel
  group([
    query(':enter', enterMetadata, { optional: true }),
    query(':leave', leaveMetadata, { optional: true })
  ])
];

// Transition between any two states
const transitionMetadata: AnimationMetadata[] = [transition('* <=> *', animationMetadata)];

export class AppAnimation {
  static readonly slideInAnimation = trigger('slideInAnimation', transitionMetadata);
}
