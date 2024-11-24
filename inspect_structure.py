import os

main_dir_path = os.path.dirname(os.path.abspath(__file__))  # Get the current script's directory
client_dir_path = os.path.join(main_dir_path, 'client')
server_dir_path = os.path.join(main_dir_path, 'server')

client_contents = os.listdir(client_dir_path)
server_contents = os.listdir(server_dir_path)

print("Client Directory Contents:", client_contents)
print("Server Directory Contents:", server_contents)
