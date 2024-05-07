"""
Author: Shane Bonkowski
Date: May 7, 2024
Description: This Python script performs the inverse of a matrix mod some 
modulo value. This has mainly been used to confirm that the inverse modulo 
operation performed in Flip Tile game works as expected.
"""

import numpy
from sympy import Matrix


def matInvMod(vmnp: numpy.ndarray, mod: int) -> numpy.ndarray:
    """
    Calculates the inverse for a given matrix with a given modulus.

    Parameters
    ----------
    vmnp : numpy.ndarray
        The matrix for which to compute the inverse. Must be a square matrix.
    mod : int
        The modulus.

    Returns
    -------
    numpy.ndarray
        The inverse of the matrix modulo mod.
    """
    nr = vmnp.shape[0]
    nc = vmnp.shape[1]

    # Matrix must be square
    if nr != nc:
        print("Error: Non-square matrix! Exiting")
        exit()

    # Calculate the inverse of the matrix modulo mod using Sympy
    vmsym = Matrix(vmnp)  # must be matrix format
    vmsymInv = vmsym.inv_mod(mod)
    vmnpInv = numpy.array(vmsymInv)  # back to array

    # Perform a test to validate the inverse calculation
    k = nr
    vmtest = [[1 for i in range(k)] for j in range(k)]  # Initialize a 2D list
    vmtestInv = vmsym * vmsymInv  # Calculate the product of the matrix and its inverse
    for i in range(k):
        for j in range(k):
            # Perform modulo operation to ensure elements are within mod
            vmtest[i][j] = vmtestInv[i, j] % mod
    print("Test vmk*vkinv % mod... expecting identity matrix:\n", vmtest)

    # Return the inverse of the matrix modulo mod
    return vmnpInv


if __name__ == "__main__":
    # Define the modulus
    p = 2

    # Define the matrix
    vm = numpy.array(
        [
            [1, 1],
            [1, 0],
        ]
    )

    # Compute the inverse of the matrix modulo p
    vminv = matInvMod(vm, p)
    numpy.set_printoptions(
        formatter={"all": lambda x: f"{x},"}
    )  # include all comas in print
    print("\n")
    print(f"Inverted Matrix Mod {p}")
    print(vminv)
    print("\n")
