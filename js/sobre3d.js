// ============================================================
// SOBRE 3D REALISTA CON THREE.JS
// ============================================================

class Sobre3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.sobre = null;
        this.tapa = null;
        this.sello = null;
        this.mariposas = [];
        this.abierto = false;
        this.animando = false;
        this.progresoApertura = 0;
        this.mariposasVolando = [];
        
        this.init();
        this.crearSobre();
        this.crearMariposas();
        this.animar();
    }
    
    init() {
        const container = document.getElementById('threeCanvas');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        // Escena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x2D6A4F);
        
        // Cámara
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(4, 3, 6);
        this.camera.lookAt(0, 0, 0);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        container.appendChild(this.renderer.domElement);
        
        // Luces
        this.crearLuces();
        
        // Eventos
        window.addEventListener('resize', () => this.onResize());
        container.addEventListener('click', () => this.abrirSobre());
        container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.abrirSobre();
        }, { passive: false });
    }
    
    crearLuces() {
        // Luz ambiental suave
        const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
        this.scene.add(ambientLight);
        
        // Luz principal (soft)
        const mainLight = new THREE.DirectionalLight(0xffeedd, 1.2);
        mainLight.position.set(5, 8, 3);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        this.scene.add(mainLight);
        
        // Luz de relleno
        const fillLight = new THREE.DirectionalLight(0x4488ff, 0.4);
        fillLight.position.set(-3, 2, -4);
        this.scene.add(fillLight);
        
        // Luz de borde
        const rimLight = new THREE.DirectionalLight(0x88ddff, 0.6);
        rimLight.position.set(-2, 1, 5);
        this.scene.add(rimLight);
        
        // Luz de fondo
        const backLight = new THREE.DirectionalLight(0x66aaff, 0.3);
        backLight.position.set(0, -1, -5);
        this.scene.add(backLight);
    }
    
    crearSobre() {
        const grupo = new THREE.Group();
        
        // ===== CUERPO DEL SOBRE =====
        const cuerpoGeo = new THREE.BoxGeometry(3.2, 0.15, 2.4);
        const cuerpoMat = new THREE.MeshPhysicalMaterial({
            color: 0x3A7D5A,
            roughness: 0.4,
            metalness: 0.05,
            clearcoat: 0.1,
            clearcoatRoughness: 0.3,
            envMapIntensity: 0.5,
        });
        const cuerpo = new THREE.Mesh(cuerpoGeo, cuerpoMat);
        cuerpo.position.y = -0.3;
        cuerpo.castShadow = true;
        cuerpo.receiveShadow = true;
        grupo.add(cuerpo);
        
        // ===== TAPA DEL SOBRE =====
        const tapaGroup = new THREE.Group();
        
        // Tapa principal (triangular)
        const formaTapa = new THREE.Shape();
        formaTapa.moveTo(-1.6, 0);
        formaTapa.quadraticCurveTo(-1.6, 1.0, 0, 1.8);
        formaTapa.quadraticCurveTo(1.6, 1.0, 1.6, 0);
        formaTapa.lineTo(-1.6, 0);
        
        const tapaExtrudeSettings = {
            steps: 1,
            depth: 0.08,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelSegments: 8,
        };
        
        const tapaGeo = new THREE.ExtrudeGeometry(formaTapa, tapaExtrudeSettings);
        const tapaMat = new THREE.MeshPhysicalMaterial({
            color: 0x2D6A4F,
            roughness: 0.3,
            metalness: 0.05,
            clearcoat: 0.2,
            clearcoatRoughness: 0.2,
            side: THREE.DoubleSide,
        });
        const tapaMesh = new THREE.Mesh(tapaGeo, tapaMat);
        tapaMesh.position.set(-1.6, 0.08, -1.2);
        tapaMesh.rotation.x = 0.15;
        tapaMesh.castShadow = true;
        tapaMesh.receiveShadow = true;
        tapaGroup.add(tapaMesh);
        
        // Solapa interior (visible cuando se abre)
        const solapaGeo = new THREE.PlaneGeometry(2.8, 1.2);
        const solapaMat = new THREE.MeshPhysicalMaterial({
            color: 0x4A8A6A,
            roughness: 0.6,
            metalness: 0.02,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3,
        });
        const solapa = new THREE.Mesh(solapaGeo, solapaMat);
        solapa.position.set(0, 0.12, 0.6);
        solapa.rotation.x = -0.2;
        tapaGroup.add(solapa);
        
        // Posicionar tapa
        tapaGroup.position.set(0, 0.15, 0);
        tapaGroup.rotation.x = 0;
        grupo.add(tapaGroup);
        this.tapa = tapaGroup;
        
        // ===== SELLO PLATEADO CON MARIPOSA =====
        const selloGroup = new THREE.Group();
        
        // Base del sello (plateada)
        const selloBaseGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.06, 32);
        const selloBaseMat = new THREE.MeshPhysicalMaterial({
            color: 0xC0C0C0,
            roughness: 0.15,
            metalness: 0.9,
            envMapIntensity: 1.5,
        });
        const selloBase = new THREE.Mesh(selloBaseGeo, selloBaseMat);
        selloBase.position.y = 0.03;
        selloBase.castShadow = true;
        selloGroup.add(selloBase);
        
        // Anillo decorativo del sello
        const anilloGeo = new THREE.TorusGeometry(0.3, 0.04, 16, 32);
        const anilloMat = new THREE.MeshPhysicalMaterial({
            color: 0xDDDDDD,
            roughness: 0.2,
            metalness: 0.85,
            envMapIntensity: 1.2,
        });
        const anillo = new THREE.Mesh(anilloGeo, anilloMat);
        anillo.position.y = 0.06;
        anillo.rotation.x = Math.PI / 2;
        selloGroup.add(anillo);
        
        // Mariposa 3D (simplificada con formas geométricas)
        const mariposaGroup = this.crearMariposa3D();
        mariposaGroup.position.y = 0.12;
        mariposaGroup.scale.set(0.15, 0.15, 0.15);
        selloGroup.add(mariposaGroup);
        
        // Brillo del sello (punto de luz)
        const brilloGeo = new THREE.SphereGeometry(0.02, 8, 8);
        const brilloMat = new THREE.MeshPhysicalMaterial({
            color: 0xFFFFFF,
            emissive: 0x88CCFF,
            emissiveIntensity: 0.5,
        });
        const brillo = new THREE.Mesh(brilloGeo, brilloMat);
        brillo.position.set(0.15, 0.1, 0.15);
        selloGroup.add(brillo);
        
        // Posicionar sello
        selloGroup.position.set(0, 0.2, 0.6);
        grupo.add(selloGroup);
        this.sello = selloGroup;
        
        // ===== BORDES DECORATIVOS =====
        this.crearBordes(grupo);
        
        // ===== SOMBRA =====
        const sombraGeo = new THREE.PlaneGeometry(3.6, 2.8);
        const sombraMat = new THREE.MeshPhysicalMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.15,
            roughness: 1,
            metalness: 0,
            side: THREE.DoubleSide,
        });
        const sombra = new THREE.Mesh(sombraGeo, sombraMat);
        sombra.position.set(0, -0.4, 0);
        sombra.rotation.x = -Math.PI / 2;
        grupo.add(sombra);
        
        // Agregar al grupo principal
        this.scene.add(grupo);
        this.sobre = grupo;
    }
    
    crearMariposa3D() {
        const group = new THREE.Group();
        
        // Ala izquierda
        const alaShape = new THREE.Shape();
        alaShape.moveTo(0, 0);
        alaShape.quadraticCurveTo(-0.5, 0.4, -0.3, 0.8);
        alaShape.quadraticCurveTo(-0.1, 0.6, 0, 0.4);
        alaShape.quadraticCurveTo(0.1, 0.6, 0.3, 0.8);
        alaShape.quadraticCurveTo(0.5, 0.4, 0, 0);
        
        const alaExtrudeSettings = {
            steps: 1,
            depth: 0.02,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelSegments: 4,
        };
        
        const alaGeo = new THREE.ExtrudeGeometry(alaShape, alaExtrudeSettings);
        const alaMat = new THREE.MeshPhysicalMaterial({
            color: 0x88DDAA,
            roughness: 0.3,
            metalness: 0.1,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide,
            envMapIntensity: 0.5,
        });
        
        // Ala izquierda
        const alaIzq = new THREE.Mesh(alaGeo, alaMat);
        alaIzq.scale.x = -1;
        alaIzq.position.x = -0.15;
        alaIzq.rotation.z = 0.3;
        group.add(alaIzq);
        
        // Ala derecha
        const alaDer = new THREE.Mesh(alaGeo, alaMat);
        alaDer.position.x = 0.15;
        alaDer.rotation.z = -0.3;
        group.add(alaDer);
        
        // Cuerpo
        const cuerpoMariposaGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 6);
        const cuerpoMariposaMat = new THREE.MeshPhysicalMaterial({
            color: 0x2D3A2D,
            roughness: 0.6,
            metalness: 0.1,
        });
        const cuerpoMariposa = new THREE.Mesh(cuerpoMariposaGeo, cuerpoMariposaMat);
        cuerpoMariposa.position.y = 0.15;
        cuerpoMariposa.rotation.x = 0.2;
        group.add(cuerpoMariposa);
        
        // Antenas
        const antenaMat = new THREE.MeshPhysicalMaterial({
            color: 0x2D3A2D,
            roughness: 0.5,
            metalness: 0.1,
        });
        
        const antenaGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.15, 4);
        const antenaIzq = new THREE.Mesh(antenaGeo, antenaMat);
        antenaIzq.position.set(-0.08, 0.32, 0);
        antenaIzq.rotation.z = 0.4;
        antenaIzq.rotation.x = -0.3;
        group.add(antenaIzq);
        
        const antenaDer = new THREE.Mesh(antenaGeo, antenaMat);
        antenaDer.position.set(0.08, 0.32, 0);
        antenaDer.rotation.z = -0.4;
        antenaDer.rotation.x = -0.3;
        group.add(antenaDer);
        
        return group;
    }
    
    crearBordes(grupo) {
        const bordeMat = new THREE.MeshPhysicalMaterial({
            color: 0x1E4D3A,
            roughness: 0.3,
            metalness: 0.1,
            transparent: true,
            opacity: 0.3,
        });
        
        // Borde superior
        const bordeGeo = new THREE.BoxGeometry(3.0, 0.02, 0.04);
        const borde1 = new THREE.Mesh(bordeGeo, bordeMat);
        borde1.position.set(0, 0.08, 1.18);
        grupo.add(borde1);
        
        const borde2 = new THREE.Mesh(bordeGeo, bordeMat);
        borde2.position.set(0, 0.08, -1.18);
        grupo.add(borde2);
        
        const borde3 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 2.2), bordeMat);
        borde3.position.set(1.58, 0.08, 0);
        grupo.add(borde3);
        
        const borde4 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 2.2), bordeMat);
        borde4.position.set(-1.58, 0.08, 0);
        grupo.add(borde4);
    }
    
    crearMariposas() {
        // Mariposas flotantes alrededor del sobre
        const colores = [0x88DDAA, 0x66CC99, 0x44BB88, 0x99EECC, 0x77DDBB];
        
        for (let i = 0; i < 6; i++) {
            const mariposa = this.crearMariposa3D();
            const escala = 0.08 + Math.random() * 0.06;
            mariposa.scale.set(escala, escala, escala);
            
            const angulo = (i / 6) * Math.PI * 2;
            const radio = 1.8 + Math.random() * 0.5;
            mariposa.position.set(
                Math.cos(angulo) * radio,
                0.3 + Math.random() * 0.5,
                Math.sin(angulo) * radio
            );
            
            mariposa.userData = {
                angulo: angulo,
                radio: radio,
                velocidad: 0.2 + Math.random() * 0.3,
                flotacion: Math.random() * Math.PI * 2,
                velocidadFlotacion: 0.5 + Math.random() * 0.5,
            };
            
            this.scene.add(mariposa);
            this.mariposas.push(mariposa);
        }
    }
    
    abrirSobre() {
        if (this.abierto || this.animando) return;
        this.animando = true;
        this.abierto = true;
        
        // Iniciar animación de apertura
        this.animarApertura();
        
        // Disparar evento para el resto de la página
        document.dispatchEvent(new CustomEvent('sobreAbierto'));
    }
    
    animarApertura() {
        const duracion = 2000; // 2 segundos
        const inicio = Date.now();
        
        const animar = () => {
            const elapsed = Date.now() - inicio;
            const progreso = Math.min(elapsed / duracion, 1);
            
            // Curva de easing (cubic-bezier)
            const ease = 1 - Math.pow(1 - progreso, 3);
            
            // Abrir tapa
            if (this.tapa) {
                this.tapa.rotation.x = -ease * 1.2;
                this.tapa.position.y = 0.15 + ease * 0.15;
            }
            
            // Sello se levanta
            if (this.sello) {
                this.sello.position.y = 0.2 + ease * 0.4;
                this.sello.rotation.x = -ease * 0.2;
                this.sello.scale.set(
                    1 + ease * 0.1,
                    1 + ease * 0.1,
                    1 + ease * 0.1
                );
            }
            
            // Crear mariposas durante la apertura
            if (progreso > 0.2 && progreso < 0.8 && Math.random() < 0.1) {
                this.crearMariposaVoladora();
            }
            
            // Mover cámara ligeramente
            this.camera.position.y = 3 - ease * 0.5;
            this.camera.lookAt(0, 0.2 - ease * 0.3, 0);
            
            if (progreso < 1) {
                requestAnimationFrame(animar);
            } else {
                this.animando = false;
                // Crear mariposas finales
                for (let i = 0; i < 8; i++) {
                    setTimeout(() => this.crearMariposaVoladora(), i * 200);
                }
            }
        };
        
        animar();
    }
    
    crearMariposaVoladora() {
        const mariposa = this.crearMariposa3D();
        const escala = 0.06 + Math.random() * 0.08;
        mariposa.scale.set(escala, escala, escala);
        
        // Posición inicial (desde el sobre)
        mariposa.position.set(
            (Math.random() - 0.5) * 2,
            0.3 + Math.random() * 0.3,
            (Math.random() - 0.5) * 1.5
        );
        
        // Rotación aleatoria
        mariposa.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        
        this.scene.add(mariposa);
        
        // Destino (hacia la pantalla)
        const destinoX = (Math.random() - 0.5) * 8;
        const destinoY = 1 + Math.random() * 3;
        const destinoZ = -2 - Math.random() * 4;
        
        // Animación de vuelo
        const duracion = 2000 + Math.random() * 2000;
        const inicio = Date.now();
        const inicioX = mariposa.position.x;
        const inicioY = mariposa.position.y;
        const inicioZ = mariposa.position.z;
        
        const animarVuelo = () => {
            const elapsed = Date.now() - inicio;
            const progreso = Math.min(elapsed / duracion, 1);
            
            // Movimiento con curva
            const ease = 1 - Math.pow(1 - progreso, 2);
            mariposa.position.x = inicioX + (destinoX - inicioX) * ease;
            mariposa.position.y = inicioY + (destinoY - inicioY) * ease + Math.sin(elapsed / 500) * 0.3;
            mariposa.position.z = inicioZ + (destinoZ - inicioZ) * ease;
            
            // Rotación
            mariposa.rotation.x += 0.02;
            mariposa.rotation.y += 0.03;
            mariposa.rotation.z += 0.01;
            
            // Desvanecer
            mariposa.children.forEach(child => {
                if (child.material) {
                    child.material.opacity = 1 - ease * 0.5;
                    child.material.transparent = true;
                }
            });
            
            if (progreso < 1) {
                requestAnimationFrame(animarVuelo);
            } else {
                // Eliminar después de un tiempo
                setTimeout(() => {
                    this.scene.remove(mariposa);
                }, 500);
            }
        };
        
        animarVuelo();
    }
    
    onResize() {
        const container = document.getElementById('threeCanvas');
        const width = container.clientWidth;
        const height = container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animar() {
        requestAnimationFrame(() => this.animar());
        
        // Animación de mariposas flotantes
        const tiempo = Date.now() / 1000;
        this.mariposas.forEach((mariposa, index) => {
            const data = mariposa.userData;
            if (data) {
                mariposa.position.x = Math.cos(data.angulo + tiempo * data.velocidad) * data.radio;
                mariposa.position.z = Math.sin(data.angulo + tiempo * data.velocidad) * data.radio;
                mariposa.position.y = 0.3 + Math.sin(tiempo * data.velocidadFlotacion + data.flotacion) * 0.3;
                mariposa.rotation.y += 0.01;
                mariposa.rotation.z = Math.sin(tiempo * 0.5 + index) * 0.1;
                
                // Aleteo
                mariposa.children.forEach(child => {
                    if (child.geometry && child.geometry.type === 'ExtrudeGeometry') {
                        child.rotation.z += Math.sin(tiempo * 3 + index) * 0.001;
                    }
                });
            }
        });
        
        // Sello brillo pulsante
        if (this.sello && !this.abierto) {
            const pulse = 0.8 + Math.sin(tiempo * 2) * 0.2;
            this.sello.children.forEach(child => {
                if (child.material && child.material.emissiveIntensity !== undefined) {
                    child.material.emissiveIntensity = 0.3 + pulse * 0.3;
                }
            });
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// ============================================================
// INICIALIZAR
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const sobre3D = new Sobre3D();
    
    // Escuchar evento de apertura
    document.addEventListener('sobreAbierto', () => {
        // Ocultar el sobre 3D después de la animación
        setTimeout(() => {
            const container = document.getElementById('sobreContainer');
            container.classList.add('abierto');
            document.body.style.overflow = 'auto';
            document.getElementById('menuNavegacion').style.display = 'flex';
            document.getElementById('mariposaCentral').classList.add('visible');
        }, 2500);
    });
});