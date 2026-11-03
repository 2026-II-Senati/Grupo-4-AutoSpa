# PFA-18 — Avance local

Se implementaron las rutas administrativas de servicios, sus validaciones, separación por rutas/controladores/servicios/repositorio y la protección mediante `requireAuth` para que no sea publico, Se mantiene `GET /api/services` y no se modificaron órdenes, migraciones ni Docker hasta agregar un usuario autenticado y mientras eso saldra " la sesion no es valida"

Dependencia de cierre: conectar `requireAuth` con el middleware real de PFA-19 para probar una sesión válida. Mientras tanto, las solicitudes sin sesión se rechazan con `401`.
