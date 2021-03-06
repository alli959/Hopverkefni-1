function UIList() {
    this.setup(this);
};

//UIList.prototype = new UIElement();

UIList.prototype = Object.create(UIElement.prototype);


UIList.prototype.update = function () {

    const children = this._children;

    const n = children.length;

    const allotedHeight = this.getHeight() / n;

    for (let i = 0; i < children.length; i += 1) {
        const child = children[i];
        child.setPosition(this._x, this._y + allotedHeight * i);
        child._setProvidedDimensions(this.getWidth(), allotedHeight);
        child.update();
    }
};