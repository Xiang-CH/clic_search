#!/bin/sh

# echo ""
# echo "Loading azd .env file from current environment"
# echo ""

# while IFS='=' read -r key value; do
#     value=$(echo "$value" | sed 's/^"//' | sed 's/"$//')
#     export "$key=$value"
# done <<EOF
# $(azd env get-values)
# EOF

# if [ $? -ne 0 ]; then
#     echo "Failed to load environment variables from azd environment"
#     exit $?
# fi

echo 'Creating python virtual environment "backend_env"'
python -m venv backend_env

echo ""
echo "Restoring backend python packages"
echo ""

./backend_env/bin/python -m pip install --upgrade pip
./backend_env/bin/python -m pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Failed to restore backend python packages"
    exit $?
fi


echo ""
echo "Starting backend"
echo ""


# ./backend_env/bin/python ./app.py
./backend_env/bin/python -m flask run --port=5000 --reload --debug
if [ $? -ne 0 ]; then
    echo "Failed to start backend"
    exit $?
fi
# open http://127.0.0.1:5000