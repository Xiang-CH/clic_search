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
echo "Restoring frontend npm packages"
echo ""


cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to restore frontend npm packages"
    exit $?
fi


echo ""
echo "Building frontend"
echo ""


npm run build
if [ $? -ne 0 ]; then
    echo "Failed to build frontend"
    exit $?
fi

cd ../backend
az webapp up -n clic-search --resource-group rg-CLICSearch --runtime PYTHON:3.9 --sku B1 --logs