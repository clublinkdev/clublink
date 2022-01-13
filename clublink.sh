#!/bin/sh

# If "node_modules" folder exists
if [ -d "./node_modules" ] 2>/dev/null
then
	echo "Welcome to ClubLink!"
	read -r -p "Do you want to view data about GUIs that are opened? [Y/n] " input
	case $input in
		[yY][eE][sS]|[yY])
			read -r -p "Do you want to send GG's when people buy boxes from store.mineclub.com? [Y/n] " input1
			case $input1 in
				[yY][eE][sS]|[yY])
					ts-node ./src/index.ts --gui --gg
				;;
				[nN][oO]|[nN])
					ts-node ./src/index.ts --gui
				;;
			*)
				echo "Invalid input!"
				exit
				;;
			esac
			;;
			
		[nN][oO]|[nN])
			read -r -p "Do you want to send GG's when people buy boxes from store.mineclub.com? [Y/n] " input2
			case $input2 in
			yY][eE][sS]|[yY])
					ts-node ./src/index.ts --gg
				;;
				[nN][oO]|[nN])
					ts-node ./src/index.ts
				;;
			*)
				echo "Invalid input!"
				exit
				;;
			esac
			;;
	*)
		echo "Invalid input!"
		exit
		;;
	esac
	
# If "node_modules" folder not exists
else
	echo "Modules not detected. Application hasn't been installed."
	# If using WindowsOS, skip sudo prompt
	if [ "$OSTYPE" == "msys" ] || [ "$OSTYPE" == "cygwin" ]
	then
		read -r -p "Do you wish to run the installation? [Y/n] " input
		case $input in
			[yY][eE][sS]|[yY])
				npm i
				npm i -g typescript ts-node
			;;
			[nN][oO]|[nN])
				exit
			;;
		*)
			echo "Invalid input!"
			exit
			;;
		esac

	else
		read -r -p "Do you wish to run the installation with sudo/root privileges? (recommended for Linux) [Y/n] " input
		case $input in
			[yY][eE][sS]|[yY])
				sudo npm i
				sudo npm i -g typescript ts-node
			;;
			[nN][oO]|[nN])
				npm i
				npm i -g typescript ts-node
			;;
		*)
			echo "Invalid input!"
			exit
			;;
		esac

	fi
	
	echo ""
	echo ""
	echo "All modules have been installed. Adjust the .env file, then run this file again."
fi