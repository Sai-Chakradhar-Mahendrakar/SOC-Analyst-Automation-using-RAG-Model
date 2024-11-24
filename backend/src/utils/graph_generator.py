import matplotlib.pyplot as plt
import os

def generate_bar_graph_from_query(query_result, output_path="./query_graph.png"):
    """
    Generate a bar graph based on query result.

    Args:
        query_result (dict): Dictionary where keys are labels and values are numerical data.
        output_path (str): Path to save the generated graph image.

    Returns:
        str: Path to the saved image.
    """
    labels = list(query_result.keys())
    data = list(query_result.values())

    plt.figure(figsize=(10, 6))
    plt.bar(labels, data, color='steelblue')
    plt.title("Query Result Visualization")
    plt.xlabel("Labels")
    plt.ylabel("Values")
    plt.tight_layout()

    # Save the graph to the specified path
    plt.savefig(output_path)
    plt.close()
    return output_path
