git clone git@github.com:adherelive/adherelive-web.git
git checkout developement-env
docker compose -f docker-compose-dev.yml build node
docker compose up -d
docker compose -f docker-compose-dev.yml run node npm install
docker compose -f docker-compose-dev.yml run node npm run migrate
docker compose -f docker-compose-dev.yml run node npm run seed
docker compose -f docker-compose-dev.yml up -d
docker ps
