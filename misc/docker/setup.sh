which docker >/dev/null
if [ $? -ne 0 ]
then
    echo "ERR: Install docker" >&2
else    
    which docker-compose >/dev/null
    if [ $? -ne 0 ]
    then
        echo "ERR: Install docker-compose" >&2
    else #docker and docker-compose are installed
        unzip ../../dist.zip >/dev/null
        docker-compose up
    fi

fi
