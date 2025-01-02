/**
 * @author David Infante, Jose Ariza
 * 
 */

class Crosshair extends THREE.Object3D {

  constructor () {
    super();

    this.material = new THREE.LineBasicMaterial({ color: 0x23ff02 });

    this.xLenght = 0.0007;
    this.yLenght = 0.005;
    this.zLenght = 0.0;
    this.crosshairPos = 0.0075;

    this.crosshair = null;
    
    this.crosshair = this.createRoot();
    this.add (this.crosshair);

    // Add method to window object for WebGazer integration
    if (typeof window !== 'undefined') {
      window.updateCrosshair = (x, y) => {
        if (this.crosshair) {
          // Convert screen coordinates to rotation angles
          const angleX = ((x / window.innerWidth) - 0.5) * Math.PI;
          const angleY = ((y / window.innerHeight) - 0.5) * Math.PI;
          
          // Update crosshair rotation
          this.crosshair.rotation.y = -angleX * 0.5; // Horizontal movement
          this.crosshair.rotation.x = angleY * 0.5;  // Vertical movement
        }
      };
    }
  }
  
  // It creates de tree's root
  createRoot() {
    var root = new THREE.Object3D();
    root.castShadow = false;
    root.autoUpdateMatrix = false;
    root.updateMatrix();
    root.add(this.createCrosshair("U"));
    root.add(this.createCrosshair("D"));
    root.add(this.createCrosshair("L"));
    root.add(this.createCrosshair("R"));
    return root;
  }

  // It creates one of the four crosshair parts
  createCrosshair(part) {
    var rectangle = new THREE.Mesh (new THREE.BoxGeometry (this.xLenght, this.yLenght, this.zLenght), this.material);

    rectangle.castShadow = false;
    rectangle.autoUpdateMatrix = false;
    
    switch (part) {
      case "U":
        rectangle.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, this.crosshairPos, 0));
      break;
      case "D":
        rectangle = new THREE.Mesh (new THREE.BoxGeometry (this.xLenght, this.yLenght, this.zLenght), this.material);
        rectangle.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, -this.crosshairPos, 0));
      break;
      case "L":
        rectangle = new THREE.Mesh (new THREE.BoxGeometry (this.yLenght, this.xLenght, this.zLenght), this.material);
        rectangle.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (-this.crosshairPos, 0, 0));
      break;
      case "R":
        rectangle = new THREE.Mesh (new THREE.BoxGeometry (this.yLenght, this.xLenght, this.zLenght), this.material);
        rectangle.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.crosshairPos, 0, 0));
      break;
    }

    rectangle.updateMatrix();

    return rectangle;
  }
  
}
