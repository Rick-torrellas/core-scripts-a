@echo off
mongodump --uri %MONGO_URI_DOWNLOAD% --out ./nucleo/data/mongo
exit