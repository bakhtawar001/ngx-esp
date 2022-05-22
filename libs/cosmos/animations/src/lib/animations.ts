import {
  sequence,
  trigger,
  animate,
  style,
  group,
  query,
  transition,
  animateChild,
  state,
  animation,
  useAnimation,
  stagger,
} from '@angular/animations';

const customAnimation = animation(
  [
    style({
      opacity: '{{opacity}}',
      transform: 'scale({{scale}}) translate3d({{x}}, {{y}}, {{z}})',
    }),
    animate(
      '{{duration}} {{delay}} cubic-bezier(0.0, 0.0, 0.2, 1)',
      style('*')
    ),
  ],
  {
    params: {
      duration: '200ms',
      delay: '0ms',
      opacity: '0',
      scale: '1',
      x: '0',
      y: '0',
      z: '0',
    },
  }
);

export const COSMOS_ANIMATE = trigger('animate', [
  transition('void => *', [useAnimation(customAnimation)]),
]);

export const COSMOS_ANIMATE_STAGGER = trigger('animateStagger', [
  state('50', style('*')),
  state('100', style('*')),
  state('200', style('*')),

  transition(
    'void => 50',
    query('@*', [stagger('50ms', [animateChild()])], { optional: true })
  ),
  transition(
    'void => 100',
    query('@*', [stagger('100ms', [animateChild()])], { optional: true })
  ),
  transition(
    'void => 200',
    query('@*', [stagger('200ms', [animateChild()])], { optional: true })
  ),
]);

export const COSMOS_FADE_IN_OUT = trigger('fadeInOut', [
  state(
    '0',
    style({
      display: 'none',
      opacity: 0,
    })
  ),
  state(
    '1',
    style({
      display: 'block',
      opacity: 1,
    })
  ),
  transition('1 => 0', animate('300ms ease-out')),
  transition('0 => 1', animate('300ms ease-in')),
]);

export const COSMOS_SLIDE_IN_OUT = trigger('slideInOut', [
  state(
    '0',
    style({
      height: '0px',
      display: 'none',
    })
  ),
  state(
    '1',
    style({
      height: '*',
      display: 'block',
    })
  ),
  transition('1 => 0', animate('300ms ease-out')),
  transition('0 => 1', animate('300ms ease-in')),
]);

export const COSMOS_SLIDE_IN = trigger('slideIn', [
  transition('void => left', [
    style({
      transform: 'translateX(100%)',
    }),
    animate(
      '300ms ease-in',
      style({
        transform: 'translateX(0)',
      })
    ),
  ]),
  transition('left => void', [
    style({
      transform: 'translateX(0)',
    }),
    animate(
      '300ms ease-in',
      style({
        transform: 'translateX(-100%)',
      })
    ),
  ]),
  transition('void => right', [
    style({
      transform: 'translateX(-100%)',
    }),
    animate(
      '300ms ease-in',
      style({
        transform: 'translateX(0)',
      })
    ),
  ]),
  transition('right => void', [
    style({
      transform: 'translateX(0)',
    }),
    animate(
      '300ms ease-in',
      style({
        transform: 'translateX(100%)',
      })
    ),
  ]),
]);

export const COSMOS_SLIDE_IN_LEFT = trigger('slideInLeft', [
  state(
    'void',
    style({
      transform: 'translateX(-100%)',
      display: 'none',
    })
  ),
  state(
    '*',
    style({
      transform: 'translateX(0)',
      display: 'flex',
    })
  ),
  transition('void => *', animate('300ms')),
  transition('* => void', animate('300ms')),
]);

export const COSMOS_SLIDE_IN_RIGHT = trigger('slideInRight', [
  state(
    'void',
    style({
      transform: 'translateX(100%)',
      display: 'none',
    })
  ),
  state(
    '*',
    style({
      transform: 'translateX(0)',
      display: 'flex',
    })
  ),
  transition('void => *', animate('300ms')),
  transition('* => void', animate('300ms')),
]);

export const SLIDE_IN_TOP = trigger('slideInTop', [
  state(
    'void',
    style({
      transform: 'translateY(-100%)',
      display: 'none',
    })
  ),
  state(
    '*',
    style({
      transform: 'translateY(0)',
      display: 'flex',
    })
  ),
  transition('void => *', animate('300ms')),
  transition('* => void', animate('300ms')),
]);

export const COSMOS_SLIDE_IN_BOTTOM = trigger('slideInBottom', [
  state(
    'void',
    style({
      transform: 'translateY(100%)',
      display: 'none',
    })
  ),
  state(
    '*',
    style({
      transform: 'translateY(0)',
      display: 'flex',
    })
  ),
  transition('void => *', animate('300ms')),
  transition('* => void', animate('300ms')),
]);

export const COSMOS_EXPAND_COLLAPSE = trigger('expandCollapse', [
  state(
    'void',
    style({
      height: '0px',
    })
  ),
  state(
    '*',
    style({
      height: '*',
    })
  ),
  transition('void => *', animate('300ms ease-out')),
  transition('* => void', animate('300ms ease-in')),
]);

// -----------------------------------------------------------------------------------------------------
// @ Router animations
// -----------------------------------------------------------------------------------------------------

export const COSMOS_ROUTER_TRANSITION_LEFT = trigger('routerTransitionLeft', [
  transition('* => *', [
    query(
      'content > :enter, content > :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }),
      ],
      { optional: true }
    ),
    query(
      'content > :enter',
      [
        style({
          transform: 'translateX(100%)',
          opacity: 0,
        }),
      ],
      { optional: true }
    ),
    sequence([
      group([
        query(
          'content > :leave',
          [
            style({
              transform: 'translateX(0)',
              opacity: 1,
            }),
            animate(
              '600ms cubic-bezier(0.0, 0.0, 0.2, 1)',
              style({
                transform: 'translateX(-100%)',
                opacity: 0,
              })
            ),
          ],
          { optional: true }
        ),
        query(
          'content > :enter',
          [
            style({ transform: 'translateX(100%)' }),
            animate(
              '600ms cubic-bezier(0.0, 0.0, 0.2, 1)',
              style({
                transform: 'translateX(0%)',
                opacity: 1,
              })
            ),
          ],
          { optional: true }
        ),
      ]),
      query('content > :leave', animateChild(), { optional: true }),
      query('content > :enter', animateChild(), { optional: true }),
    ]),
  ]),
]);

export const COSMOS_ROUTER_TRANSITION_RIGHT = trigger('routerTransitionRight', [
  transition('* => *', [
    query(
      'content > :enter, content > :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }),
      ],
      { optional: true }
    ),
    query(
      'content > :enter',
      [
        style({
          transform: 'translateX(-100%)',
          opacity: 0,
        }),
      ],
      { optional: true }
    ),
    sequence([
      group([
        query(
          'content > :leave',
          [
            style({
              transform: 'translateX(0)',
              opacity: 1,
            }),
            animate(
              '600ms cubic-bezier(0.0, 0.0, 0.2, 1)',
              style({
                transform: 'translateX(100%)',
                opacity: 0,
              })
            ),
          ],
          { optional: true }
        ),
        query(
          'content > :enter',
          [
            style({ transform: 'translateX(-100%)' }),
            animate(
              '600ms cubic-bezier(0.0, 0.0, 0.2, 1)',
              style({
                transform: 'translateX(0%)',
                opacity: 1,
              })
            ),
          ],
          { optional: true }
        ),
      ]),
      query('content > :leave', animateChild(), { optional: true }),
      query('content > :enter', animateChild(), { optional: true }),
    ]),
  ]),
]);

export const COSMOS_ROUTER_TRANSITION_UP = trigger('routerTransitionUp', [
  transition('* => *', [
    query(
      'content > :enter, content > :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }),
      ],
      { optional: true }
    ),
    query(
      'content > :enter',
      [
        style({
          transform: 'translateY(100%)',
          opacity: 0,
        }),
      ],
      { optional: true }
    ),
    group([
      query(
        'content > :leave',
        [
          style({
            transform: 'translateY(0)',
            opacity: 1,
          }),
          animate(
            '600ms cubic-bezier(0.0, 0.0, 0.2, 1)',
            style({
              transform: 'translateY(-100%)',
              opacity: 0,
            })
          ),
        ],
        { optional: true }
      ),
      query(
        'content > :enter',
        [
          style({ transform: 'translateY(100%)' }),
          animate(
            '600ms cubic-bezier(0.0, 0.0, 0.2, 1)',
            style({
              transform: 'translateY(0%)',
              opacity: 1,
            })
          ),
        ],
        { optional: true }
      ),
    ]),
    query('content > :leave', animateChild(), { optional: true }),
    query('content > :enter', animateChild(), { optional: true }),
  ]),
]);

export const COSMOS_ROUTER_TRANSITION_DOWN = trigger('routerTransitionDown', [
  transition('* => *', [
    query(
      'content > :enter, content > :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }),
      ],
      { optional: true }
    ),
    query(
      'content > :enter',
      [
        style({
          transform: 'translateY(-100%)',
          opacity: 0,
        }),
      ],
      { optional: true }
    ),
    sequence([
      group([
        query(
          'content > :leave',
          [
            style({
              transform: 'translateY(0)',
              opacity: 1,
            }),
            animate(
              '600ms cubic-bezier(0.0, 0.0, 0.2, 1)',
              style({
                transform: 'translateY(100%)',
                opacity: 0,
              })
            ),
          ],
          { optional: true }
        ),
        query(
          'content > :enter',
          [
            style({ transform: 'translateY(-100%)' }),
            animate(
              '600ms cubic-bezier(0.0, 0.0, 0.2, 1)',
              style({
                transform: 'translateY(0%)',
                opacity: 1,
              })
            ),
          ],
          { optional: true }
        ),
      ]),
      query('content > :leave', animateChild(), { optional: true }),
      query('content > :enter', animateChild(), { optional: true }),
    ]),
  ]),
]);

export const COSMOS_ROUTER_TRANSITION_FADE = trigger('routerTransitionFade', [
  transition(
    '* => *',
    group([
      query(
        'content > :enter, content > :leave ',
        [
          style({
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }),
        ],
        { optional: true }
      ),

      query(
        'content > :enter',
        [
          style({
            opacity: 0,
          }),
        ],
        { optional: true }
      ),
      query(
        'content > :leave',
        [
          style({
            opacity: 1,
          }),
          animate(
            '300ms cubic-bezier(0.0, 0.0, 0.2, 1)',
            style({
              opacity: 0,
            })
          ),
        ],
        { optional: true }
      ),
      query(
        'content > :enter',
        [
          style({
            opacity: 0,
          }),
          animate(
            '300ms cubic-bezier(0.0, 0.0, 0.2, 1)',
            style({
              opacity: 1,
            })
          ),
        ],
        { optional: true }
      ),
      query('content > :enter', animateChild(), { optional: true }),
      query('content > :leave', animateChild(), { optional: true }),
    ])
  ),
]);
