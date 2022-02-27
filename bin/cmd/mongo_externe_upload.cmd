@echo off
IF NOT DEFINED MONGO_URI_UPLOAD (
echo Variable MONGO_URI_UPLOAD no esta definida
call :end
) 
IF [%MONGO_URI_UPLOAD%]==[] (
    echo La variable MONGO_URI_UPLOAD esta vacia 
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
    echo MONGO_URI_UPLOAD - %MONGO_URI_UPLOAD%
)
:inicio
mongorestore --uri %MONGO_URI_UPLOAD% ./.nucleo/data/mongo
:end
timeout /T 300
exit