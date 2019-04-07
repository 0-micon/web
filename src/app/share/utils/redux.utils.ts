interface ActionCreatorsMapObject {
  [key: string]: (...args: any[]) => any;
}
export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>;

export type Action<T extends string, P = void> = P extends void
  ? Readonly<{ type: T }>
  : Readonly<{ type: T; payload: P }>;

export type OfType<ActionUnion, ActionType extends string> = ActionUnion extends Action<ActionType>
  ? ActionUnion
  : never;

export function createAction<T extends string>(type: T): Action<T>;
export function createAction<T extends string, P>(type: T, payload: P): Action<T, P>;
export function createAction<T extends string, P>(type: T, payload?: P) {
  return { type, payload };
}
