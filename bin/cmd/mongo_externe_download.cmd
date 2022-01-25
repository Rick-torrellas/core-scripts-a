@echo off
IF NOT DEFINED MONGO_URI_DOWNLOAD (
echo Variable MONGO_URI_DOWNLOAD no esta definida
call :end
) 
IF [%MONGO_URI_DOWNLOAD%]==[] (
    echo La variable MONGO_URI_DOWNLOAD esta vacia 
    call :end
)
:inicio
@REM TODO: crear un proceso debug donde muestre las variables
mongodump --uri %MONGO_URI_DOWNLOAD% --out ./.nucleo/data/mongo
:end
timeout /T 300
exit