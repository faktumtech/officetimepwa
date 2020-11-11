# officetimepwa dockerfile
# create new nginx image and copy build officetimepwa app

# Complete build and deploy process without using hub
# 1) Build dev image
#    docker build --pull --no-cache -f Dockerfile.dev -t officetimepwa.dev .
# 2) Run npm build in dev image
#    docker run --rm -it  -p 8080:8080 -v $PWD:/officetimepwa -v /officetimepwa/node_modules/ officetimepwa.dev npm run build
# 3) Build prod image
#    docker build -t officetimepwa .
# 4) Save image for deploy without using hub
#    docker save -o officetimepwa.docker.tar officetimepwa
# 5) Send image to remote host
#    rsync -rv --verbose --progress --rsh='ssh -p[PORT]' *.docker.tar [USER]@[IP]:[PATH]
# 6) Load image in remote host
#    ssh -p[PORT] -4 [USER]@[IP] 'docker load -i officetimepwa.docker.tar'
# 7) Stop and remove old image in remote host
#    ssh -p[PORT] -4 [USER]@[IP] 'docker rm -f officetimepwa_container'
# 8) Start new image in remote host
#    ssh -p[PORT] -4 [USER]@[IP] 'docker run --name officetimepwa_container -d --restart=unless-stopped -p 3009:80 officetimepwa'
# 9) Check docker status on remote host
#    ssh -p[PORT] -4 [USER]@[IP] 'docker ps'


# build (prefix with 'cfbutt/' if you want to push to docker hub)
# docker build -t officetimepwa .

# push to docker hub
# docker push cfbutt/officetimepwa

# save image for deploy without using hub
# docker save -o officetimepwa.docker.tar officetimepwa

# send image to remote host
# rsync -rv --verbose --progress --rsh='ssh -p[PORT]' *.docker.tar [USER]@[IP]:[PATH]

# execute commands on remote host
# ssh -p[PORT] -4 [USER]@[IP] '[command / docker command]'

# pull image from docker hub
# docker pull cfbutt/officetimepwa

# import image without using hub
# docker load -i officetimepwa.docker.tar

# run as daemon with (exposing 3009)
# docker run --name officetimepwa_container -d --restart=unless-stopped -p 3009:80 officetimepwa

# stop container
# docker stop officetimepwa_container

# stop and remove container
# docker rm -f officetimepwa_container


# use nginx:alpine
FROM nginx:alpine

# Build to nginx web dir
COPY dist /usr/share/nginx/html

# Document where a service is available, but not create any mapping to the host
EXPOSE 80