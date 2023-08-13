export interface IControlServices {
    registerControl(control: any): void;
    // ... other methods
}

class ControlService implements IControlServices {
    registerControl(control: any) {
        //... implementation
    }
}
