@echo off
IF NOT DEFINED MONGO_URI_UPLOAD (
echo Variable MONGO_URI_UPLOAD no esta definida
call :end
) 
IF [%MONGO_URI_UPLOAD%]==[] (
    echo La variable MONGO_URI_UPLOAD esta vacia 
    call :end
)
:inicio
@REM TODO: crear un proceso debug donde muestre las variables
mongorestore --uri %MONGO_URI_UPLOAD% ./.nucleo/data/mongo
:end
timeout /T 300
exit