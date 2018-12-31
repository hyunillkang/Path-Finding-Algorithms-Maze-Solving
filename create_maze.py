
import random
import time
import os
import msvcrt

class Maze:
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.contents = []

class Cursor:
    def __init__(self, row, col):
        self.row = row
        self.col = col

def createMazeFrame(rows, cols):
    maze = Maze(rows, cols)
    for i in range(rows):
        temp = []
        for j in range(cols):
            if i == 0 or j == 0 or i == rows-1 or j == cols-1: # fills the edges of the maze with obsticles
                temp.append('#')
            else:
                temp.append(' ')
        maze.contents.append(temp)
    
    return maze
    


def controlCursor(maze, cursor, key): # cursor moves according to pressed keyboard arrows

    if(key == 'up'):
        if(cursor.row == 0):
            return
        cursor.row -= 1
    elif(key == 'down'):
        if(cursor.row == maze.rows-1):
            return
        cursor.row += 1        
    elif(key == 'left'):
        if(cursor.col == 0):
            return
        cursor.col -= 1
    elif(key == 'right'):
        if(cursor.col == maze.cols-1):
            return
        cursor.col += 1
    elif(key == 'space'): 
        if(maze.contents[cursor.row][cursor.col] == ' ' or
            maze.contents[cursor.row][cursor.col] == 'S' or
            maze.contents[cursor.row][cursor.col] == 'D'): # fills the spot where the cursor is on with an obsticle 
            maze.contents[cursor.row][cursor.col] = '#'
        elif(maze.contents[cursor.row][cursor.col] == '#'): # or replaces the obsticle to empty space
            maze.contents[cursor.row][cursor.col] = ' '
    elif(key == 'start'):
        for row in range(0, maze.rows):
            for col in range(0, maze.cols):
                if(maze.contents[row][col] == 'S'): # sets the start point
                    maze.contents[row][col] = ' ' 
                    break
        maze.contents[cursor.row][cursor.col] = 'S'          
    elif(key == 'destination'):
        for row in range(0, maze.rows):
            for col in range(0, maze.cols):
                if(maze.contents[row][col] == 'D'): # sets the destination point
                    maze.contents[row][col] = ' ' 
                    break
        maze.contents[cursor.row][cursor.col] = 'D'
            

def printMaze(maze, cursor):
    for row in range(0, maze.rows):
        for col in range(0, maze.cols):
            if(row == cursor.row and col == cursor.col):
                print('O',end=' ')
            else:
                print(maze.contents[row][col], end=' ')
        print('\n')
    print("Arrow keys: move cursor")
    print("Space: create/remove obstacle")
    print("S/D: set start/destination point")
    print("O: output the current maze file")
    print("ESC: exit")
    
def outputMazeFile(maze):
    f = open('mazefile.txt', "w")
    for row in range(0, maze.rows):
        for col in range(0, maze.cols):
            f.write(maze.contents[row][col])
        f.write('\n')
    print("mazefile.txt is created successfully.")

def getKeyboardArrow():
    key = ord(msvcrt.getch())
    if (key == 72):
        key = 'up'
    elif (key == 80):
        key = 'down'
    elif (key == 75):
        key = 'left'
    elif (key == 77):
        key = 'right'
    elif (key == 32):
        key = 'space'
    elif(key == 115 or key == 83):
        key = 'start'
    elif(key == 100 or key == 68):
        key = 'destination'
    elif(key == 111 or key == 79):
        key = 'output'
    elif (key == 27):
        exit()

    return key


rows = int(input("Input the rows of the maze size: "))
cols = int(input("Input the cols of the maze size: "))


cursor =  Cursor(1, 1) 
maze = createMazeFrame(rows, cols)
while True:
    os.system('cls')
    printMaze(maze, cursor)
    key = getKeyboardArrow()
    if(key == 'output'):
        outputMazeFile(maze)
        key = getKeyboardArrow()
    controlCursor(maze, cursor, key)
    
#    if(key != None):
#        print(key)
    
#    time.sleep(1)