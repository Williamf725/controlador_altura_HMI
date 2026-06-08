HMI para Planta de Control de Altura (ESP32)Esta es la interfaz web (HMI) diseñada para monitorear y controlar en tiempo real una planta de control de altura en eje vertical impulsada por una hélice (motor brushless). 
A través de esta pantalla, se puede interactuar directamente con el ESP32 para evaluar y ajustar el comportamiento del sistema.
¿Qué hace esta interfaz? 
Control PID en caliente: Permite cambiar los valores de $K_p$, $K_i$, $K_d$, el setpoint (altura deseada) y el PWM máximo directamente desde el panel, sin necesidad de reiniciar el microcontrolador ni detener el ensayo.
Gráficas en tiempo real: Visualización continua de la distancia medida por los sensores frente al setpoint para analizar la estabilidad y el tiempo de respuesta del sistema.
Conexión remota estable: Comunicación bidireccional mediante WebSockets apuntando a HiveMQ Cloud (MQTT), lo que permite controlar la planta de manera inalámbrica.

Tecnologías utilizadas:
El entorno de desarrollo se pensó para que sea ligero, rápido y fácil de ejecutar:Frontend: React 18 + Vite 6 (para un arranque inmediato).
Comunicación: MQTT.js (manejo de suscripción y publicación de tópicos).
Gráficas: Chart.js junto con React-Chartjs-2.Estilos: CSS3 moderno (Flexbox, Grid y variables de diseño) con una estética limpia y oscura para facilitar la lectura de datos.

Autores: William Pinilla • Carlos Rodriguez • Luis Pinilla.