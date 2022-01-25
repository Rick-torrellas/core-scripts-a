@echo off
mongorestore --uri %MONGO_URI_UPLOAD% ./nucleo/data/mongo
exit