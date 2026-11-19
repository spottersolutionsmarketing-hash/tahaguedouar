(function () {
  'use strict';
function initCharacter3D() {
var container = document.getElementById('tg-character-3d');
if (!container || typeof THREE === 'undefined') return;
var width = container.clientWidth || 320;
var height = container.clientHeight || 320;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
camera.position.set(0, 0.06, 4.15);
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0);
if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
container.innerHTML = '';
container.appendChild(renderer.domElement);
renderer.domElement.style.display = 'block';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.touchAction = 'none';
renderer.domElement.style.cursor = 'grab';
  var hemiLight = new THREE.HemisphereLight(0xfffaf4, 0x3b2d26, 0.9);
scene.add(hemiLight);
var keyLight = new THREE.DirectionalLight(0xfff5ea, 1.35);
keyLight.position.set(3.2, 4.2, 5.0);
scene.add(keyLight);
var fillLight = new THREE.DirectionalLight(0xeaf1ff, 0.65);
fillLight.position.set(-4.0, 1.5, 3.2);
scene.add(fillLight);
var rimLight = new THREE.DirectionalLight(0xffe2c4, 0.85);
rimLight.position.set(0.2, 3.2, -4.2);
scene.add(rimLight);
var characterGroup = new THREE.Group();
scene.add(characterGroup);
var skinMat = new THREE.MeshStandardMaterial({ color: 0xE8D6C7, roughness: 0.72, metalness: 0.02 });
var headGeo = new THREE.SphereGeometry(1, 64, 64);
var headMesh = new THREE.Mesh(headGeo, skinMat);
headMesh.scale.set(1.0, 1.02, 0.98);
characterGroup.add(headMesh);
var browMat = new THREE.MeshStandardMaterial({ color: 0x2B1B14, roughness: 0.62, metalness: 0.04 });
function createBrow(side) {
var pts = [
new THREE.Vector3(side * 0.14, 0.37, 0.92),
new THREE.Vector3(side * 0.28, 0.43, 0.88),
new THREE.Vector3(side * 0.44, 0.39, 0.79)
];
var curve = new THREE.CatmullRomCurve3(pts);
var tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.036, 12, false), browMat);
var g = new THREE.Group();
g.add(tube);
var capGeo = new THREE.SphereGeometry(0.036, 12, 12);
var c1 = new THREE.Mesh(capGeo, browMat);
c1.position.copy(pts[0]);
var c2 = new THREE.Mesh(capGeo, browMat);
c2.position.copy(pts[2]);
g.add(c1, c2);
return g;
}
characterGroup.add(createBrow(-1), createBrow(1));
  var glassesGroup = new THREE.Group();
var frameMat = new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.25, metalness: 0.35 });
var lensMat = new THREE.MeshStandardMaterial({ color: 0x0b0b0e, roughness: 0.08, metalness: 0.65, transparent: true, opacity: 0.92 });
function roundedRectShape(w, h, r) {
var s = new THREE.Shape();
var hw = w / 2, hh = h / 2;
s.moveTo(-hw + r, -hh);
s.lineTo(hw - r, -hh);
s.quadraticCurveTo(hw, -hh, hw, -hh + r);
s.lineTo(hw, hh - r);
s.quadraticCurveTo(hw, hh, hw - r, hh);
s.lineTo(-hw + r, hh);
s.quadraticCurveTo(-hw, hh, -hw, hh - r);
s.lineTo(-hw, -hh + r);
s.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
return s;
}
var outerRimShape = roundedRectShape(0.46, 0.31, 0.085);
outerRimShape.holes.push(roundedRectShape(0.39, 0.24, 0.06));
var rimGeo = new THREE.ExtrudeGeometry(outerRimShape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.014, bevelSize: 0.012, bevelSegments: 3 });
var lensGeo = new THREE.ExtrudeGeometry(roundedRectShape(0.40, 0.25, 0.06), { depth: 0.018, bevelEnabled: false });
[-1, 1].forEach(function (side) {
var eyeG = new THREE.Group();
eyeG.add(new THREE.Mesh(rimGeo, frameMat));
var lens = new THREE.Mesh(lensGeo, lensMat);
lens.position.z = 0.012;
eyeG.add(lens);
eyeG.position.set(side * 0.31, 0.14, 0.94);
eyeG.rotation.set(-0.04, side * 0.22, side * -0.03);
glassesGroup.add(eyeG);
var templeCurve = new THREE.CatmullRomCurve3([
new THREE.Vector3(side * 0.53, 0.19, 0.87),
new THREE.Vector3(side * 0.96, 0.17, 0.42),
new THREE.Vector3(side * 1.04, 0.14, -0.08),
new THREE.Vector3(side * 0.92, 0.07, -0.48)
]);
glassesGroup.add(new THREE.Mesh(new THREE.TubeGeometry(templeCurve, 20, 0.022, 10, false), frameMat));
});
var bridgeCurve = new THREE.CatmullRomCurve3([
new THREE.Vector3(-0.11, 0.19, 1.00),
new THREE.Vector3(0, 0.21, 1.03),
new THREE.Vector3(0.11, 0.19, 1.00)
]);
glassesGroup.add(new THREE.Mesh(new THREE.TubeGeometry(bridgeCurve, 12, 0.022, 10, false), frameMat));
characterGroup.add(glassesGroup);
var hairGroup = new THREE.Group();
var hairMat = new THREE.MeshStandardMaterial({ color: 0x6B3F2E, roughness: 0.56, metalness: 0.05 });
var hairDarkMat = new THREE.MeshStandardMaterial({ color: 0x2B1B14, roughness: 0.65, metalness: 0.03 });
var crownCap = new THREE.Mesh(new THREE.SphereGeometry(1.035, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
crownCap.rotation.x = -0.34;
hairGroup.add(crownCap);
var backVolume = new THREE.Mesh(new THREE.SphereGeometry(1.03, 40, 28), hairDarkMat);
backVolume.scale.set(1.01, 0.96, 0.86);
backVolume.position.set(0, 0.12, -0.22);
hairGroup.add(backVolume);
var hairLocks = [];
function addHairLock(pts, radius, mat, amp, phase) {
var origin = pts[0].clone();
var localPts = pts.map(function (p) { return p.clone().sub(origin); });
var curve = new THREE.CatmullRomCurve3(localPts);
var lockG = new THREE.Group();
lockG.position.copy(origin);
lockG.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 20, radius, 10, false), mat));
var endCap = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.92, 10, 10), mat);
endCap.position.copy(localPts[localPts.length - 1]);
lockG.add(endCap);
hairGroup.add(lockG);
hairLocks.push({ mesh: lockG, amp: amp, phase: phase });
}
[-1, 1].forEach(function (s, idx) {
addHairLock([
new THREE.Vector3(s * 0.06, 0.96, 0.36),
new THREE.Vector3(s * 0.34, 0.86, 0.56),
new THREE.Vector3(s * 0.66, 0.62, 0.66),
new THREE.Vector3(s * 0.82, 0.32, 0.56)
], 0.145, hairMat, 0.018, idx * 1.4);
addHairLock([
new THREE.Vector3(s * 0.10, 0.92, 0.44),
new THREE.Vector3(s * 0.44, 0.72, 0.68),
new THREE.Vector3(s * 0.72, 0.44, 0.68),
new THREE.Vector3(s * 0.78, 0.18, 0.52)
], 0.115, hairDarkMat, 0.022, idx * 1.4 + 0.7);
addHairLock([
new THREE.Vector3(s * 0.20, 0.98, 0.12),
new THREE.Vector3(s * 0.64, 0.78, 0.32),
new THREE.Vector3(s * 0.96, 0.44, 0.24),
new THREE.Vector3(s * 1.03, 0.08, 0.05)
], 0.155, hairMat, 0.016, idx * 1.1 + 1.2);
addHairLock([
new THREE.Vector3(s * 0.26, 0.92, -0.18),
new THREE.Vector3(s * 0.76, 0.68, -0.14),
new THREE.Vector3(s * 1.02, 0.32, -0.18),
new THREE.Vector3(s * 1.00, -0.06, -0.22)
], 0.16, hairDarkMat, 0.015, idx * 1.3 + 2.0);
addHairLock([
new THREE.Vector3(s * 0.24, 0.86, -0.46),
new THREE.Vector3(s * 0.62, 0.52, -0.72),
new THREE.Vector3(s * 0.78, 0.16, -0.78),
new THREE.Vector3(s * 0.76, -0.16, -0.70)
], 0.165, hairMat, 0.017, idx * 1.7 + 2.5);
});
[-0.44, -0.15, 0.15, 0.44].forEach(function (bx, i) {
addHairLock([
new THREE.Vector3(bx * 0.5, 0.88, -0.52),
new THREE.Vector3(bx * 0.95, 0.54, -0.88),
new THREE.Vector3(bx * 1.05, 0.14, -0.96),
new THREE.Vector3(bx * 0.95, -0.22, -0.84)
], 0.17, i % 2 === 0 ? hairMat : hairDarkMat, 0.016, i * 0.9 + 0.4);
});
characterGroup.add(hairGroup);
  var collarGroup = new THREE.Group();
function createCamoTexture() {
var c = document.createElement('canvas');
c.width = 512;
c.height = 512;
var ctx = c.getContext('2d');
ctx.fillStyle = '#E8D6C7';
ctx.fillRect(0, 0, 512, 512);
var palette = ['#B56734', '#6B3F2E', '#FBF7F2', '#B56734', '#E8D6C7', '#6B3F2E'];
for (var layer = 0; layer < 6; layer++) {
ctx.fillStyle = palette[layer];
for (var j = 0; j < 7; j++) {
ctx.beginPath();
var y0 = ((layer * 67 + j * 83) % 512);
ctx.moveTo(-40, y0);
for (var x = 0; x <= 560; x += 64) {
var wave = Math.sin(x * 0.018 + layer * 1.3 + j) * 42 + Math.cos(x * 0.009 - j) * 24;
ctx.lineTo(x, y0 + wave);
}
for (var x2 = 560; x2 >= -40; x2 -= 64) {
var wave2 = Math.sin(x2 * 0.018 + layer * 1.3 + j + 0.9) * 38 + 52;
ctx.lineTo(x2, y0 + wave2);
}
ctx.closePath();
ctx.fill();
}
}
var tex = new THREE.CanvasTexture(c);
tex.wrapS = THREE.RepeatWrapping;
tex.wrapT = THREE.RepeatWrapping;
tex.repeat.set(2, 1.5);
if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
return tex;
}
var camoMat = new THREE.MeshStandardMaterial({ map: createCamoTexture(), roughness: 0.72, metalness: 0.03 });
var shirtBase = new THREE.Mesh(new THREE.SphereGeometry(1.022, 48, 24, 0, Math.PI * 2, Math.PI * 0.67, Math.PI * 0.33), camoMat);
shirtBase.scale.set(1.0, 1.02, 0.98);
collarGroup.add(shirtBase);
var collarRing = new THREE.Mesh(new THREE.TorusGeometry(0.84, 0.068, 14, 48, Math.PI * 1.66), camoMat);
collarRing.position.set(0, -0.52, 0);
collarRing.rotation.set(Math.PI / 2 + 0.06, 0, Math.PI * 0.67);
collarGroup.add(collarRing);
var flapShape = new THREE.Shape();
flapShape.moveTo(0, 0);
flapShape.lineTo(0.24, -0.05);
flapShape.lineTo(0.16, -0.25);
flapShape.lineTo(-0.02, -0.18);
flapShape.closePath();
var flapGeo = new THREE.ExtrudeGeometry(flapShape, { depth: 0.026, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2 });
var btnMat = new THREE.MeshStandardMaterial({ color: 0xFBF7F2, roughness: 0.4, metalness: 0.1 });
var btnGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.016, 16);
[-1, 1].forEach(function (side) {
var flap = new THREE.Mesh(flapGeo, camoMat);
flap.position.set(side * 0.07, -0.51, 0.80);
flap.rotation.set(-0.28, side * 0.28, side === -1 ? 0.15 : -0.15);
if (side === -1) flap.scale.x = -1;
collarGroup.add(flap);
var btn = new THREE.Mesh(btnGeo, btnMat);
btn.position.set(side * 0.16, -0.66, 0.77);
btn.rotation.set(Math.PI / 2 - 0.35, 0, side * 0.2);
collarGroup.add(btn);
});
var vNeckMat = new THREE.MeshStandardMaterial({ color: 0xFBF7F2, roughness: 0.8, metalness: 0.02 });
var vShape = new THREE.Shape();
vShape.moveTo(-0.18, 0.04);
vShape.lineTo(0.18, 0.04);
vShape.lineTo(0.08, -0.26);
vShape.lineTo(-0.08, -0.26);
vShape.closePath();
var vMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(vShape, { depth: 0.025, bevelEnabled: false }), vNeckMat);
vMesh.position.set(0, -0.58, 0.74);
vMesh.rotation.x = 0.56;
collarGroup.add(vMesh);
var cordMat = new THREE.MeshStandardMaterial({ color: 0x2B1B14, roughness: 0.45, metalness: 0.25 });
var cordCurve = new THREE.CatmullRomCurve3([
new THREE.Vector3(-0.34, -0.54, 0.68),
new THREE.Vector3(-0.14, -0.67, 0.74),
new THREE.Vector3(0, -0.73, 0.72),
new THREE.Vector3(0.14, -0.67, 0.74),
new THREE.Vector3(0.34, -0.54, 0.68)
]);
collarGroup.add(new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 24, 0.011, 8, false), cordMat));
var pendantGroup = new THREE.Group();
pendantGroup.position.set(0, -0.79, 0.70);
pendantGroup.rotation.x = 0.48;
pendantGroup.add(new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.011, 12, 32), cordMat));
pendantGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.145, 10), cordMat));
[-1, 1].forEach(function (s) {
var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.075, 10), cordMat);
leg.position.set(s * 0.025, -0.026, 0);
leg.rotation.z = s * -Math.PI / 4;
pendantGroup.add(leg);
});
var bail = new THREE.Mesh(new THREE.TorusGeometry(0.015, 0.0045, 8, 16), cordMat);
bail.position.y = 0.084;
bail.rotation.y = Math.PI / 2;
pendantGroup.add(bail);
collarGroup.add(pendantGroup);
characterGroup.add(collarGroup);
var isDragging = false;
var prevX = 0, prevY = 0;
var dragRotY = 0, dragRotX = 0;
var targetDragY = 0, targetDragX = 0;
var lookX = 0, lookY = 0;
var targetLookX = 0, targetLookY = 0;
var dom = renderer.domElement;
dom.addEventListener('pointerdown', function (e) {
isDragging = true;
prevX = e.clientX;
prevY = e.clientY;
dom.style.cursor = 'grabbing';
if (dom.setPointerCapture) dom.setPointerCapture(e.pointerId);
});
window.addEventListener('pointermove', function (e) {
if (isDragging) {
targetDragY += (e.clientX - prevX) * 0.011;
targetDragX = Math.max(-0.55, Math.min(0.55, targetDragX + (e.clientY - prevY) * 0.008));
prevX = e.clientX;
prevY = e.clientY;
} else {
var rect = container.getBoundingClientRect();
var cx = rect.left + rect.width * 0.5;
var cy = rect.top + rect.height * 0.5;
targetLookX = Math.max(-1, Math.min(1, (e.clientX - cx) / Math.max(rect.width, 320))) * 0.22;
targetLookY = Math.max(-1, Math.min(1, (e.clientY - cy) / Math.max(rect.height, 320))) * 0.14;
}
});
function endDrag() {
if (isDragging) {
isDragging = false;
dom.style.cursor = 'grab';
}
}
window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', endDrag);
function handleResize() {
var w = container.clientWidth || 320;
var h = container.clientHeight || 320;
camera.aspect = w / h;
camera.updateProjectionMatrix();
renderer.setSize(w, h);
}
if (typeof ResizeObserver !== 'undefined') {
new ResizeObserver(handleResize).observe(container);
} else {
window.addEventListener('resize', handleResize);
}
var clock = new THREE.Clock();
function animate() {
requestAnimationFrame(animate);
var t = clock.getElapsedTime();
dragRotY += (targetDragY - dragRotY) * 0.1;
dragRotX += (targetDragX - dragRotX) * 0.1;
lookX += (targetLookX - lookX) * 0.06;
lookY += (targetLookY - lookY) * 0.06;
var floatY = Math.sin(t * 1.6) * 0.045 + Math.abs(Math.sin(t * 1.6)) * 0.012;
characterGroup.position.y = floatY;
characterGroup.rotation.y = dragRotY + lookX + Math.sin(t * 0.7) * 0.055;
characterGroup.rotation.x = dragRotX + lookY + Math.sin(t * 0.9 + 0.5) * 0.032;
characterGroup.rotation.z = Math.sin(t * 1.15) * 0.042;
for (var k = 0; k < hairLocks.length; k++) {
var lk = hairLocks[k];
lk.mesh.rotation.z = Math.sin(t * 1.9 + lk.phase) * lk.amp;
lk.mesh.rotation.x = Math.cos(t * 1.5 + lk.phase) * (lk.amp * 0.6);
}
renderer.render(scene, camera);
}
animate();
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', initCharacter3D);
} else {
initCharacter3D();
}
})();
renderer.domElement.style.cursor = 'grab';
  
