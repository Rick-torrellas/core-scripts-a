@echo off
:var_check
set carpeta=.nucleo-%npm_package_name%
IF NOT DEFINED carpeta (
echo Variable carpeta no esta definida
call :end
) 
IF [%carpeta%]==[] (
    echo La variable carpeta esta vacia 
    call :end
)
IF NOT DEFINED npm_package_name (
echo Variable npm_package_name no esta definida
call :end
) 
IF [%npm_package_name%]==[] (
    echo La variable npm_package_name esta vacia 
    call :end
)
IF NOT DEFINED MEGA_MAIL_A (
echo Variable MEGA_MAIL_A no esta definida
call :end
) 
IF [%MEGA_MAIL_A%]==[] (
    echo La variable MEGA_MAIL_A esta vacia 
    call :end
)
IF NOT DEFINED MEGA_PASS_A (
echo Variable MEGA_PASS_A no esta definida
call :end
) 
IF [%MEGA_PASS_A%]==[] (
    echo La variable MEGA_PASS_Aesta vacia 
    call :end
)
IF NOT DEFINED DEBUG (
echo Variable DEBUG no esta definida
call :end
) 
IF [%DEBUG%]==[] (
    echo La variable DEBUG esta vacia 
    call :end
)
:debug
IF [%DEBUG%]==[true] (
    echo Debugger activado
)
IF [%DEBUG%]==[true] (
    echo carpeta - %carpeta%
)
IF [%DEBUG%]==[true] (
    echo npm_package_name - %npm_package_name%
)
IF [%DEBUG%]==[true] (
    echo MEGA_MAIL_A - %MEGA_MAIL_A%
)
IF [%DEBUG%]==[true] (
    echo MEGA_PASS_A - %MEGA_PASS_A%
)
:check
@REM  TODO: Este deberia ser un script aparte
megatools test -d /Root/%carpeta% -u %MEGA_MAIL_A% -p %MEGA_PASS_A%
if %ERRORLEVEL% EQU 1 (
    echo No existe la carpeta destino en la cuenta de Mega
    echo Creando carpeta %carpeta%
:create_dir
    megatools mkdir /Root/%carpeta% -u %MEGA_MAIL_A% -p %MEGA_PASS_A%
    megatools test -d /Root/%carpeta% -u %MEGA_MAIL_A% -p %MEGA_PASS_A%
    if %ERRORLEVEL% EQU 1 (
        echo Error al crear la careta %carpeta%, volviendo a intentarlo
        call :create_dir
    )
    if %ERRORLEVEL% EQU 0 (
    echo Carpeta creada correctamente: %carpeta% 
    exit /b
)
)
if %ERRORLEVEL% EQU 0 (
    echo Carpeta en orden: /Root/%carpeta%
    call :update
)
:update
if exist .nucleo (
    echo Carpeta .nucleo verificada
    megatools copy --local ./.nucleo --remote /Root/%carpeta% -u %MEGA_MAIL_A% -p %MEGA_PASS_A%
    echo Operacion terminada 
    timeout /T 300
    exit
) else (
    echo No existe la carpeta .nucleo
)
:end
timeout /T 300
exit