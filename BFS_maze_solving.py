import os

class Maze:
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.contents = []
        self.start = None
        self.destination = None

class Cursor:
    def __init__(self, row, col):
        self.row = row
        self.col = col

def openMazeFile():
    contents = []
    f = open('mazefile.txt', 'r')
    while True:
        line = f.readline()
        if not line:
            break
        temp = []
        for tile in line:
            if tile == '\n':
                continue
            temp.append(tile)
        contents.append(temp)

    rows = len(contents)
    cols = len(contents[0])
    maze = Maze(rows, cols)
    maze.contents = contents

    for row in range(0, rows):
        for col in range(0, cols):
            if(maze.contents[row][col] == 'S'):
                maze.start = [row, col]
            elif(maze.contents[row][col] == 'D'):
                maze.destination = [row, col]
                
    return maze

def printMaze(maze, cursor):
    os.system('cls')
    for row in range(0, maze.rows):
        for col in range(0, maze.cols):
            if(row == cursor.row and col == cursor.col):
                print('O',end=' ')
            else:
                print(maze.contents[row][col], end=' ')
        print()

def findBFSPath(maze, cursor):
    queue = [[cursor.row, cursor.col]]
    step = 0
    while True:
        if not queue:
            break
        currentCoord = queue.pop(0)
        cursor.row = currentCoord[0]
        cursor.col = currentCoord[1]
        step += 1
        if(maze.contents[cursor.row][cursor.col] == 'D'):
            printMaze(maze, cursor)
            print("Destination Found!")
            print("Final Step: ", end = '')
            print(step)
            break
        if(maze.contents[cursor.row][cursor.col] != 'S'):
            maze.contents[cursor.row][cursor.col] = '.'
        printMaze(maze, cursor)
        moveCursor(maze, cursor, queue)

        print("Current Queue: ", end = '')
        print(queue)
        print("Current Step: ", end = '')
        print(step)
        input()


def moveCursor(maze, cursor, queue):
    row = cursor.row
    col = cursor.col
    if(row-1 >= 0):
        if(maze.contents[row-1][col] == ' ' or maze.contents[row-1][col] == 'D'):
            if not [row-1, col] in queue:
                queue.append([row-1, col])
    if(col-1 >= 0):
        if(maze.contents[row][col-1] == ' ' or maze.contents[row][col-1] == 'D'):
            if not [row, col-1] in queue:
                queue.append([row, col-1])
    if(row+1 < maze.rows):
        if(maze.contents[row+1][col] == ' ' or maze.contents[row+1][col] == 'D'):
            if not [row+1, col] in queue:
                queue.append([row+1, col])
    if(col+1 < maze.cols):
        if(maze.contents[row][col+1] == ' ' or maze.contents[row][col+1] == 'D'):
            if not [row, col+1] in queue:
                queue.append([row, col+1])
    
    



maze = openMazeFile()

print(maze.start)
print(maze.destination)

cursor = Cursor(maze.start[0], maze.start[1])
print(cursor.row, cursor.col)
findBFSPath(maze, cursor)