export class KuButton {
    public button: HTMLButtonElement;

    public attached(): void {
        let options: kendo.ui.ButtonOptions = {
            enable: true
        };

        jQuery(this.button).kendoButton(options);
    }
}
