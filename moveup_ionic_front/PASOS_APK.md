# 🚀 Pasos Rápidos para Generar APK

## ⚡ Método Rápido (3 pasos)

### Paso 1: Agregar plataforma Android (solo la primera vez)
```bash
npm run android:add
```

### Paso 2: Construir y sincronizar
```bash
npm run android:sync
```

### Paso 3: Abrir en Android Studio
```bash
npm run android:open
```

---

## 📱 En Android Studio:

1. **Conecta tu celular por USB** y habilita "Depuración USB"
2. **Selecciona tu dispositivo** en la barra superior
3. **Haz clic en "Run"** (▶️) o presiona `Shift + F10`
4. La app se instalará automáticamente en tu celular

---

## 📦 Para Generar APK:

### APK de Debug (para pruebas):
1. En Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. El APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`
3. Transfiere el APK a tu celular e instálalo

### APK de Release (para publicar):
1. **Build → Generate Signed Bundle / APK → APK**
2. Sigue el asistente para firmar el APK
3. El APK estará en: `android/app/build/outputs/apk/release/app-release.apk`

---

## ⚠️ Requisitos:

- ✅ **Android Studio** instalado ([Descargar](https://developer.android.com/studio))
- ✅ **Java JDK 8+** instalado
- ✅ Celular Android con **"Opciones de desarrollador"** habilitadas

---

## 🔧 Si tienes problemas:

### Error: "No se encuentra Android SDK"
1. Abre Android Studio
2. Ve a: **More Actions → SDK Manager**
3. Instala: Android SDK Platform, Build-Tools, Command-line Tools

### El APK no se instala
1. Ve a: **Configuración → Seguridad → Fuentes desconocidas**
2. Habilita la instalación desde fuentes desconocidas

### La app se cierra
1. Abre la terminal y ejecuta: `adb logcat`
2. Revisa los errores que aparecen

---

## 💡 Tip: Live Reload

Para ver cambios en tiempo real sin reinstalar:

1. Ejecuta: `npm start` (en una terminal)
2. En Android Studio, configura la URL en `MainActivity.java`:
   ```java
   server.setServerBasePath("http://TU_IP:4200");
   ```
3. Los cambios se reflejarán automáticamente en tu celular

---

## 📝 Comandos Útiles:

```bash
# Ver dispositivos conectados
adb devices

# Ver logs en tiempo real
adb logcat

# Instalar APK directamente
adb install app-debug.apk

# Desinstalar la app
adb uninstall io.ionic.starter
```

