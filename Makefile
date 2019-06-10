tag="v0.9.0"

build_website:
	yarn run build

build_docker: build_website
	docker build -t nicholasjackson/emojify-website:latest .
	docker tag nicholasjackson/emojify-website:latest nicholasjackson/emojify-website:${tag}

run_docker:
	docker run -it -p 0.0.0.0:5000:80 nicholasjackson/emojify-website

push_docker:
	docker push nicholasjackson/emojify-website:${tag}
	docker push nicholasjackson/emojify-website:latest

build_and_push: build_docker push_docker
