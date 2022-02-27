@echo off
IF NOT DEFINED MONGO_URI_DOWNLOAD (
echo Variable MONGO_URI_DOWNLOAD no esta definida
call :end
) 
IF [%MONGO_URI_DOWNLOAD%]==[] (
    echo La variable MONGO_URI_DOWNLOAD esta vacia 
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
    echo MONGO_URI_DOWNLOAD - %MONGO_URI_DOWNLOAD%
)
:inicio
mongodump --uri %MONGO_URI_DOWNLOAD% --out ./.nucleo/data/mongo
:end
timeout /T 300
exit