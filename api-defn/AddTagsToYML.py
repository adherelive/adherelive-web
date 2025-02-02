import json
from collections import defaultdict

def optimize_swagger_doc(swagger_json):
    """
    Optimizes a Swagger/OpenAPI documentation by:
    1. Properly organizing endpoints by tags
    2. Adding missing tags and descriptions
    3. Standardizing responses
    4. Adding operation IDs
    """

    # Deep copy the original swagger doc
    optimized = swagger_json.copy()

    # Group endpoints by their first path segment
    path_groups = defaultdict(list)
    for path, methods in swagger_json['paths'].items():
        # Extract the first segment of the path (e.g., /api/admin/... -> admin)
        segments = path.split('/')
        if len(segments) > 2:
            group = segments[2]  # Get the segment after /api/
        else:
            group = 'general'
        path_groups[group].append(path)

    # Update or add tags based on grouped endpoints
    existing_tags = {tag['name'].lower(): tag for tag in optimized.get('tags', [])}
    new_tags = []

    for group in path_groups.keys():
        tag_name = group.capitalize()
        if group.lower() not in existing_tags:
            new_tags.append({
                'name': tag_name,
                'description': f'Operations related to {tag_name}'
            })

    optimized['tags'] = list(existing_tags.values()) + new_tags

    # Standardize and enhance paths
    for path, methods in optimized['paths'].items():
        segments = path.split('/')
        group = segments[2] if len(segments) > 2 else 'general'
        tag_name = group.capitalize()

        for method, details in methods.items():
            if method not in ['get', 'post', 'put', 'delete', 'patch']:
                continue

            # Add operation ID if missing
            if 'operationId' not in details:
                operation = path.replace('/', '_').strip('_')
                details['operationId'] = f"{method}_{operation}"

            # Add tags if missing
            if 'tags' not in details:
                details['tags'] = [tag_name]

            # Add description if missing
            if not details.get('description'):
                details['description'] = f"{method.upper()} operation for {path}"

            # Standardize responses
            if 'responses' not in details:
                details['responses'] = {
                    '200': {'description': 'Successful operation'},
                    '400': {'description': 'Bad request'},
                    '401': {'description': 'Unauthorized'},
                    '403': {'description': 'Forbidden'},
                    '404': {'description': 'Not found'},
                    '500': {'description': 'Internal server error'}
                }

    return optimized

def format_swagger_doc(doc):
    """
    Format the Swagger documentation with consistent indentation
    """
    return json.dumps(doc, indent=2)

def process_swagger(input_json):
    """
    Main function to process and optimize Swagger documentation
    """
    # Optimize the documentation
    optimized_doc = optimize_swagger_doc(input_json)

    # Format the documentation
    formatted_doc = format_swagger_doc(optimized_doc)

    return formatted_doc

# Usage example
if __name__ == "__main__":
    # Load your Swagger JSON
    with open('adherelive-api-swagger.json', 'r') as f:
        swagger_json = json.load(f)

    # Process and optimize
    optimized_swagger = process_swagger(swagger_json)

    # Save the optimized version
    with open('optimized_swagger.json', 'w') as f:
        f.write(optimized_swagger)