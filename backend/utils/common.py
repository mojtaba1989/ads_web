import json
import os
import pandas as pd
from datetime import datetime

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

def load_gps(dads: dict, max_len: int = 1000):
    gps = {}
    for file in dads['topics']['pos']:
        file_path = os.path.join(dads['pwd'], 'csv', file + '.pos')
        data = pd.read_csv(file_path)
        gps.update(dict(zip(data['time'].astype(int), zip(data['lat'], data['lon']))))
    keys = list(gps.keys())
    step = max(1, len(keys) // max_len)
    gps = {k: gps[k] for k in keys[::step]}
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
        if any([tag in topic for tag in ['cam', 'lidar']]):
            continue
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
    data = []
    for file in dads['topics'][topic]:
        file_path = os.path.join(dads['pwd'], 'csv', f"{file}.{topic}")
        csv_data = pd.read_csv(file_path)
        df = pd.DataFrame({
            't': csv_data['time'].astype(int),
            'value': csv_data[col].astype(float)
        })
        data.extend(df.to_dict('records'))
    data = downsample_list(data)
    return {'data': data}

def downsample_list(data: list, max_len=1000):
    if len(data) <= max_len:
        return data
    step = len(data) / max_len
    return [data[int(i * step)] for i in range(max_len)]


def load_lidar_dict(dads: dict):
    lidar_json_file = dads.get('lidar', None)
    if lidar_json_file is None:
        return None
    lidar_json_path = os.path.join(dads['pwd'], lidar_json_file)
    with open(lidar_json_path, 'r') as f:
        lidar = json.load(f)
    return lidar

def get_walltime(time: int):
    return datetime.fromtimestamp(time/1e9).strftime('%Y-%m-%d %H:%M:%S')
  










if __name__ == '__main__':
    l = list_dads("D:\\")
    print(l)
    dads = load_dads(l[1])
    gps = load_gps(dads)
    gps_df = get_gps_df(gps)
    sample = get_walltime(gps_df["time"].min())
    print(sample)