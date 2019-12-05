import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, InjectionToken, Type, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';

/** Inject a dialog-based modal implementation, suitable for interactive forms. */
export const MODAL_FORM_SERVICE = new InjectionToken('ModalFormService');
/** Inject a dialog-based modal implementation, suitable for short messages or prompts. */
export const MODAL_MESSAGE_SERVICE = new InjectionToken('ModalMessageService');
/** Inject a right-pane-based modal implementation (checkout, payment details, etc.) */
export const RIGHT_PANE_SERVICE = new InjectionToken('RightPaneService');

@Injectable()
export class ContentLoaderService {
    private _closedEvent: Subject<IContentLoaderCloseEvent> = new Subject();
    private _states: ComponentRef<any>[] = [];
    private _componentRef: ComponentRef<IContentLoaderComponent>;

    public get stateCount(): number { return this._states.length; }

    /**
     * Creates a new instance of the Content Loader service
     * @param _componentType - Component type to create. Must be of type ICOntentLoaderComponent
     * @param _resolver - Component Factory Resolver service
     * @param _viewContainer - Target view container for the new component to be created in
     */
    constructor(
        private _componentType: Type<IContentLoaderComponent>,
        private _resolver: ComponentFactoryResolver,
        private _appRef: ApplicationRef,
        private _viewContainer: ViewContainerRef
    ) {
        // Create the hosted component specified and store it with this service.
        const factory = this._resolver.resolveComponentFactory(this._componentType);
        this._componentRef = this._viewContainer.createComponent(factory);
    }

    /** Returns the closed event Subject object
     * @returns Subject object for this service
     */
    getClosedEvent(): Subject<IContentLoaderCloseEvent> {
        return this._closedEvent;
    }

    /**
     * Closes the content with a success state
     * @returns - Promise that gets resolved when the close action is complete.
     */
    completeAndClose(): Promise<void> {
        this._closedEvent.next({
            successState: true,
            states: this._states
        });
        return this.destoryAllStates();
    }

    /**
     * Closes the content with a cancelled state
     * @returns - Promise that gets resolved when the close action is complete.
     */
    cancelAndClose(): Promise<void> {
        this._closedEvent.next({
            successState: false,
            states: this._states
        });
        return this.destoryAllStates();
    }

    /**
     * Navigates to a new component state
     * @param componentType - The component to navigate to
     * @returns The ComponentRef object that was created.
     */
    navigate<T>(componentType: Type<T>): ComponentRef<T> {
        this._componentRef.instance.isVisible = true;

        // Ensure we have a valid ViewContainerRef set on this instance
        this.ensureViewContainer();

        // Clear the existing view container
        this._componentRef.instance.viewContainer.detach();

        // Create a factory and component
        const factory = this._resolver.resolveComponentFactory(componentType);
        const component = this._componentRef.instance.viewContainer.createComponent(factory);

        // Push the new component into the state stack (Push it real good)
        this._states.push(component);

        // Return the new component so data and events can be bound to it.
        return component;
    }

    /**
     * Navigates back a specified number of states
     * @param amount - The amount of states to navigate back. Default is 1
     */
    back(amount: number = 1): ComponentRef<unknown> {
        // Ensure we have a positive value for the amount in case someone sends in a negative number
        amount = Math.abs(amount);

        // Remove and destroy the specified amount of states
        while (amount > 0 && this._states.length > 0) {
            const state = this._states.pop();
            state.destroy();
            amount--;
        }

        // If we still have states left, then navigate to it, otherwise cancel and close
        if (this._states.length > 0) {
            return this.navigateToLastAvailableStateInStack();
        } else {
            this.cancelAndClose();
            return null;
        }
    }

    /**
     * Navigate backwards until the target component has been found
     * @param targetComponentType - The type of component to navigate to
     * @returns - The component reference of the state navigated back to
     */
    backToComponent<T>(targetComponentType: Type<T>): ComponentRef<T> {
        while (this._states.length > 0) {
            const state = this._states[this._states.length - 1];
            if (state.componentType === targetComponentType) {
                return this.navigateToLastAvailableStateInStack() as ComponentRef<T>;
            } else {
                this._states.pop().destroy();
            }
        }

        // Target state was not found, and everything has already been destroyed at this point
        // so ensure the content loader is closed.
        this.cancelAndClose();
        return null;
    }

    /**
     * Sets the view container to the last availble state in the navigation stack
     * @returns - The view being displayed
     */
    private navigateToLastAvailableStateInStack(): ComponentRef<unknown> {
        this._componentRef.instance.isVisible = true;

        // Ensure we have a valid ViewContainerRef set on this instance
        this.ensureViewContainer();

        // Get the last state in the stack
        const targetState = this._states[this._states.length - 1];

        // Clear the existing view container
        this._componentRef.instance.viewContainer.clear();

        // Insert the target state into the view container
        this._componentRef.instance.viewContainer.insert(targetState.hostView);

        // Force redraw of the new content
        this._appRef.tick();

        return targetState;
    }

    /** Ensures the ComponentRef instance has a valid view container to bind to. If not, an error will be thrown */
    private ensureViewContainer(): void {
        if (!this._componentRef.instance.viewContainer) {
            throw new Error('ComponentRef does not have a valid view container.');
            // If this error gets thrown, ensure that the hosted component has a valid view container.  You may need
            // to manually call the detectChanges() method if the ViewContainerRef is inside of an *ngIf block.
        }
    }

    /**
     * Destroys all existing states in the stack and sets the visibility to false.
     * @returns - Promise that gets resolved when the destroy action is complete.
     */
    private destoryAllStates(): Promise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            // If we are already hidden, don't do anything
            if (!this._componentRef.instance.isVisible) {
                resolve();
                return;
            }

            if (this._componentRef.instance.animationDoneEvent) {
                // Subscribe to the animation done event of the component. This allows any animations to happen
                // prior to us destroying the content within it.   TL;DR: Make the animation pretty.
                const subscription = this._componentRef.instance.animationDoneEvent.subscribe(event => {
                    while (this._states.length > 0) {
                        this._states.pop().destroy();
                    }
                    subscription.unsubscribe();
                    resolve();
                });

                this._componentRef.instance.isVisible = false;
            } else {
                // If no animation to worry about, then just destory the states and hide the component
                while (this._states.length > 0) {
                    this._states.pop().destroy();
                }
                this._componentRef.instance.isVisible = false;
                resolve();
            }
        });
        return promise;
    }
}

export interface IContentLoaderComponent {
    viewContainer: ViewContainerRef;
    isVisible: boolean;
    animationStartEvent?: Subject<AnimationEvent>;
    animationDoneEvent?: Subject<AnimationEvent>;
}

export interface IContentLoaderCloseEvent {
    successState: boolean;
    states: ComponentRef<any>[];
}
