import os
import json


def check_package_json(directory):
    """Check the integrity of package.json in a given directory."""
    package_json_path = os.path.join(directory, 'package.json')
    node_modules_path = os.path.join(directory, 'node_modules')

    if not os.path.exists(package_json_path):
        print(f"❌ package.json not found in {directory}")
        return

    with open(package_json_path, 'r') as file:
        package_data = json.load(file)

    # Check required fields
    required_fields = ['name', 'version', 'dependencies']
    for field in required_fields:
        if field not in package_data:
            print(f"❌ Missing required field '{field}' in {package_json_path}")

    # Check if all dependencies are installed
    if not os.path.exists(node_modules_path):
        print(f"❌ node_modules folder not found in {directory}. Run 'npm install'.")
        return

    installed_dependencies = set(os.listdir(node_modules_path))
    listed_dependencies = set(package_data.get('dependencies', {}).keys())

    missing_dependencies = listed_dependencies - installed_dependencies
    if missing_dependencies:
        print(f"❌ Missing dependencies in {directory}: {', '.join(missing_dependencies)}")
    else:
        print(f"✅ All dependencies are installed in {directory}")


def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    client_dir = os.path.join(root_dir, 'client')
    server_dir = os.path.join(root_dir, 'server')

    print("Checking client...")
    check_package_json(client_dir)

    print("\nChecking server...")
    check_package_json(server_dir)


if __name__ == "__main__":
    main()
