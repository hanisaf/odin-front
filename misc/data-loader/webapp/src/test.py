#%%
import matplotlib.pyplot as plt
import matplotlib as mpl
import numpy as np

x = np.linspace(0, 33, 100)
plt.plot(x, np.square(x)/x+100)
plt.show() 