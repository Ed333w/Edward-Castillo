# Resumen matutino de Outlook

Automatizacion de solo lectura que revisa una carpeta de Outlook y genera un
resumen matutino: remitente, asunto, hora, un resumen de 1-2 lineas y
cualquier accion o fecha limite mencionada.

Hay dos scripts:

- `test_auth.py` — prueba minima: solo autentica y lista los correos de la
  carpeta (sin resumenes). Usalo primero para confirmar que la
  autenticacion funciona antes de programar nada.
- `resumen_matutino.py` — el pipeline completo: trae solo los correos
  **nuevos** desde la ultima ejecucion (guarda el progreso en
  `state.json`), genera el resumen de 1-2 lineas y marca posibles
  acciones/fechas limite, imprime el resultado y lo guarda en
  `resumenes/YYYY-MM-DD.md`.

Enfoque elegido: script propio contra Microsoft Graph (no un servidor MCP de
terceros), con permiso delegado de solo lectura `Mail.Read` y autenticacion
por device code flow (sin client secret).

## 1. Registrar la app en Azure AD (lo haces tu, en el portal)

1. Entra a https://portal.azure.com con tu cuenta `@urosario.edu.co`.
2. Ve a **Microsoft Entra ID** (antes "Azure Active Directory") > **App
   registrations** > **New registration**.
3. Nombre: algo como `Resumen Matutino Outlook (solo lectura)`.
4. **Supported account types**: "Accounts in this organizational directory
   only (Universidad del Rosario only - Single tenant)".
5. **Redirect URI**: dejalo vacio (no se necesita para device code flow).
6. Click **Register**.
7. En la pagina "Overview" de la app recien creada, copia:
   - **Application (client) ID**
   - **Directory (tenant) ID**
8. Ve a **Authentication** (menu izquierdo) > baja hasta "Advanced
   settings" > activa **Allow public client flows** = **Yes** > **Save**.
   (Esto es obligatorio para el device code flow.)
9. Ve a **API permissions** > **Add a permission** > **Microsoft Graph** >
   **Delegated permissions** > busca y selecciona **Mail.Read** > **Add
   permissions**.
10. Si ves el boton **Grant admin consent for Universidad del Rosario** y
    tienes permisos para usarlo, click ahi. Si no lo tienes o no aparece,
    no pasa nada todavia: al ejecutar el script por primera vez se abrira
    el flujo de consentimiento normal. Si el tenant bloquea el
    consentimiento de usuario, veras un error especifico (ver seccion
    "Si la autenticacion falla" mas abajo).

Ningun secreto queda expuesto en este proceso: el Client ID y el Tenant ID
no son secretos (identifican la app, no autentican), y como es una app
"publica" (device code flow) no hay client secret que generar ni guardar.

## 2. Configurar variables de entorno (nunca en el codigo)

En PowerShell, como variables de usuario persistentes (reemplaza los
valores por los tuyos reales; hazlo tu mismo, no lo compartas en el chat):

```powershell
[Environment]::SetEnvironmentVariable("GRAPH_TENANT_ID", "TU_TENANT_ID", "User")
[Environment]::SetEnvironmentVariable("GRAPH_CLIENT_ID", "TU_CLIENT_ID", "User")
[Environment]::SetEnvironmentVariable("MAIL_FOLDER_NAME", "NOMBRE_EXACTO_DE_TU_CARPETA", "User")
```

Cierra y vuelve a abrir la terminal (o el editor) despues de esto para que
las variables se carguen.

> Nota sobre la carpeta: `test_auth.py` busca carpetas de **primer nivel**
> (hermanas de "Bandeja de entrada"). Si tu carpeta esta anidada dentro de
> otra, dimelo cuando lleguemos a esa parte y ajustamos la busqueda.

## 3. Instalar dependencias y ejecutar la prueba

Ya instale `msal` y `requests` en tu Python (3.14). Para ejecutar:

```powershell
python outlook-resumen-matutino/test_auth.py
```

La primera vez, el script imprime una URL (`https://microsoft.com/devicelogin`)
y un codigo de un solo uso. Entra ahi desde cualquier navegador, pega el
codigo, inicia sesion con tu cuenta `@urosario.edu.co` y acepta el permiso
de solo lectura de correo. El script queda esperando y, al aceptar,
imprime la lista de correos de la carpeta (remitente, asunto, fecha/hora).

El token se cachea en `token_cache.bin` (junto al script, ignorado por
git) para no repetir el login cada vez.

## Si la autenticacion falla (bloqueo del tenant)

**Confirmado en este tenant (urosario.edu.co):** el consentimiento de
usuario esta deshabilitado por completo a nivel de tenant. Se probo con la
app de primera parte de Microsoft "Microsoft Graph Command Line Tools"
(client ID `14d82eec-204b-4c2f-b7e8-296a70dab67e`, sin necesidad de
registrar nada propio) y el flujo de device code mostro directamente:

> "Microsoft Graph Command Line Tools necesita permiso para acceder a los
> recursos de su organizacion y solo un administrador puede concedérselo."

Esto significa que **ninguna app** (ni una registrada por ti, ni una de
Microsoft ya preexistente en el tenant) puede obtener el permiso delegado
`Mail.Read` sin que un administrador de IT otorgue el consentimiento
explicitamente. No hay una alternativa tecnica que evite este paso: hay
que pedirselo a IT. Ademas, el acceso al Azure Portal / Microsoft Entra
admin center tambien esta restringido para esta cuenta (error 401 al
entrar), asi que registrar la app propia tampoco es posible sin ayuda de
IT.

**Texto para pedirle a IT (cubre ambas opciones, que elijan la que les sea
mas rapida):**

> "Necesito acceso de solo lectura a mi propio correo via Microsoft Graph
> (permiso delegado `Mail.Read`, un unico scope, sin escritura) para un
> script personal de resumen diario. El consentimiento de usuario esta
> deshabilitado en el tenant, asi que necesito que un administrador
> otorgue consentimiento (admin consent) para mi cuenta con una de estas
> dos opciones:
>
> **Opcion A (mas simple si ya la usan):** otorgar consentimiento para la
> app de Microsoft 'Microsoft Graph Command Line Tools' (client ID
> `14d82eec-204b-4c2f-b7e8-296a70dab67e`), permiso delegado `Mail.Read`,
> para mi usuario.
>
> **Opcion B (mas trazable para auditoria):** registrar una app dedicada
> en Microsoft Entra ID (single-tenant, sin redirect URI, 'Allow public
> client flows' = Yes, permiso delegado `Mail.Read`), otorgar admin
> consent, y pasarme el Application (client) ID y Directory (tenant) ID
> resultantes. No se genera ni se guarda ningun client secret."

Si en cambio ves un error de Azure AD con codigo AADSTS al ejecutar el
script (en vez del mensaje de consentimiento en el navegador), usa esta
referencia:

- **AADSTS65001** ("the user or administrator has not consented..."):
  pidele a IT que otorgue **admin consent** para la app
  `Resumen Matutino Outlook (solo lectura)` (Client ID: el que copiaste en
  el paso 1), con el permiso **delegado** `Mail.Read` de Microsoft Graph.
  Enfatiza que es de **solo lectura** y un unico scope.
- **AADSTS90094** o mensajes sobre "user consent is disabled" / politica de
  consentimiento: el tenant tiene deshabilitado el consentimiento de
  usuario para apps nuevas. Pide a IT que apruebe especificamente esta app
  (mismo Client ID) o que la agreguen a la lista de apps pre-aprobadas.
- **AADSTS700016** ("Application not found in the directory"): revisa que
  `GRAPH_TENANT_ID` y `GRAPH_CLIENT_ID` sean correctos y correspondan al
  tenant de la universidad.
- Bloqueo por **Conditional Access** (ej. "Your sign-in was blocked"): pide
  a IT que la cuenta/dispositivo cumpla la politica de acceso condicional
  para esta app, o que excluyan esta app registrada especificamente para
  flujos de "device code" si esa politica los bloquea por defecto.

En todos los casos, el texto exacto para IT es:

> "Necesito que aprueben (admin consent) la app de Microsoft Entra ID
> llamada 'Resumen Matutino Outlook (solo lectura)', Client ID
> `<pegar aqui>`, con el permiso delegado de Microsoft Graph `Mail.Read`
> (solo lectura de correo, un unico scope, sin client secret, flujo device
> code)."

## Resumen con IA (opcional)

`resumen_matutino.py` funciona sin configuracion adicional: si no defines
`ANTHROPIC_API_KEY`, genera el resumen con reglas simples locales (primera
oracion del preview + deteccion de palabras clave como "fecha limite",
"antes del", "vence", etc.). Es determinista y no hace ninguna llamada
externa aparte de Microsoft Graph.

Si defines `ANTHROPIC_API_KEY` (variable de entorno, nunca en el codigo),
el script envia el asunto + remitente + vista previa de cada correo nuevo a
la API de Claude (modelo configurable con `ANTHROPIC_MODEL`, por defecto
`claude-haiku-4-5-20251001`) para generar resumenes y deteccion de
acciones/fechas limite de mejor calidad. Esto sale de tu cuenta de
Anthropic, no de este repositorio ni de Microsoft.

```powershell
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "TU_API_KEY", "User")
```

## Programar la ejecucion diaria

Una vez que `resumen_matutino.py` funcione manualmente, se puede programar
con el Task Scheduler de Windows para que corra solo cada manana (ejemplo:
7:00 AM). El token queda cacheado en `token_cache.bin` desde el primer
login por device code, asi que las ejecuciones programadas no deberian
pedir login interactivo de nuevo mientras el refresh token siga vigente.

```powershell
$action = New-ScheduledTaskAction -Execute "python" -Argument "resumen_matutino.py" -WorkingDirectory "$PWD"
$trigger = New-ScheduledTaskTrigger -Daily -At 7:00am
Register-ScheduledTask -TaskName "ResumenMatutinoOutlook" -Action $action -Trigger $trigger -Description "Resumen diario de correos nuevos (solo lectura)"
```

Para revisar, desactivar o borrar la tarea despues:

```powershell
Get-ScheduledTask -TaskName "ResumenMatutinoOutlook"
Disable-ScheduledTask -TaskName "ResumenMatutinoOutlook"
Unregister-ScheduledTask -TaskName "ResumenMatutinoOutlook" -Confirm:$false
```

No se registra esta tarea automaticamente: primero hay que confirmar que
`resumen_matutino.py` corre bien a mano al menos una vez.
