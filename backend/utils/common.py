import json
import os
import sys
import numpy as np
import pandas as pd

file_path = os.path.abspath(__file__)
dir_path = os.path.dirname(file_path)

def list_dads(parent_directory: str):
    dads_list = []
    for root, dirs, files in os.walk(parent_directory):
        for file in files:
            if file.endswith(".DADS"):
                dads_list.append(os.path.join(root, file))
    return dads_list

def load_dads(file_path: str):
    parent_directory = os.path.dirname(file_path)
    with open(file_path, 'r') as f:
        data = json.load(f)

    pwd = data.get('pwd', None)
    if pwd is None or pwd != parent_directory:
        data['pwd'] = parent_directory
    return data

def load_gps(dads: dict):
    gps = {}
    for file in dads['topics']['pos']:
        file_path = os.path.join(dads['pwd'], 'csv', file + '.pos')
        data = pd.read_csv(file_path)
        for i in range(len(data)):
            gps[int(data['time'][i])] = [float(data['lat'][i]), float(data['lon'][i])]
    return gps

def get_gps_df(gps: dict):
    gps_df = pd.DataFrame.from_dict(gps, orient='index', columns=['lat', 'lon'])
    gps_df.index.name = 'time'
    gps_df.reset_index(inplace=True)
    return gps_df


def load_video(dads: dict):
    video = []
    for file in dads['video']:
        file_path = os.path.join(dads['pwd'], file)
        if os.path.exists(file_path):
            video.append(file_path)
    return video

def get_video_sync(dads: dict):
    sync = {}
    cam_topics = [key for key in dads['topics'].keys() if 'cam' in key]
    for topic in cam_topics:
        sync[topic] = {}
        for key in dads['topics'][topic]:
            data = pd.read_csv(os.path.join(dads['pwd'], 'csv', key + '.' + topic))
            for i in range(len(data)):
                sync[topic][int(data['seq'][i])] = int(data['time'][i])
    sync['current'] = sync[cam_topics[0]]
    return sync

def change_video(sync: dict, cam: str):
    cam = os.path.basename(cam)
    selected = "_".join(cam.split('_')[:2])
    sync['current'] = sync[selected]
    return sync

def find_closest_time(dict: dict, time: int):
    best = min(dict, key=lambda f: abs(int(f) - int(time)))
    return best

def get_plot_list(dads: dict):
    plot_list = list()
    dir = os.path.join(dads['pwd'], 'csv')
    for topic in dads['topics'].keys():
        plot_list.append("--" + topic)
        file_name = dads['topics'][topic][0]+'.'+topic
        file_path = os.path.join(dir, file_name)
        data = pd.read_csv(file_path)
        for col in data.columns:
            if col == 'time':
                continue
            plot_list.append(col)            
    return plot_list


def load_chart(dads: dict, topic: str, col: str):
    data = {'data':[]}
    for file in dads['topics'][topic]:
        file_path = os.path.join(dads['pwd'], 'csv', file + '.'+topic)
        csv_data = pd.read_csv(file_path)
        for i in range(len(csv_data)):
            data[int(csv_data['time'][i])] = float(csv_data[col][i])
            data['data'].append({'t':int(csv_data['time'][i]), 'value':float(csv_data[col][i])})
    return data











if __name__ == '__main__':
    l = list_dads("D:\\")
    print(l)
    dads = load_dads(l[1])
    gps = load_gps(dads)
    topics = get_plot_list(dads)
    print(topics)