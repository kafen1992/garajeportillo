## Configuración de Índices en Firebase

Para que la aplicación funcione correctamente, necesitas crear los siguientes índices en Firebase:

1. Ve a la [Consola de Firebase](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a Firestore Database > Índices
4. En la pestaña "Índices compuestos", crea los siguientes índices:

### Colección: reservations

| Campo 1 | Campo 2 | Campo 3 | Orden    |
|---------|---------|---------|----------|
| date    | time    | -       | Asc/Asc  |
| date    | time    | status  | Asc/Asc/Asc |

### Notas importantes:

- Los índices pueden tardar unos minutos en crearse
- La aplicación funcionará con consultas simples mientras los índices se crean
- Una vez creados los índices, las consultas serán más eficientes