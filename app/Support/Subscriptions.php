<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Subscriptions {
  public static function userPlan(?int $userId): ?array {
    if (!$userId) return null;
    $today = Carbon::today()->toDateString();
    return DB::table('user_subscriptions as us')
      ->join('plans as p','p.id','=','us.plan_id')
      ->where('us.user_id',$userId)
      ->where('us.status','active')
      ->where('us.current_period_start','<=',$today)
      ->where('us.current_period_end','>=',$today)
      ->select('p.id as plan_id','p.name','p.monthly_simulacros_limit','us.current_period_start','us.current_period_end')
      ->first();
  }

  public static function canUseSimulacro(?int $userId): bool {
    $plan = self::userPlan($userId);
    if (!$plan) return false;
    if ($plan->monthly_simulacros_limit === null) return true; // ilimitado
    $month = now()->startOfMonth()->toDateString();
    $used = DB::table('user_simulacro_usage')->where('user_id',$userId)->where('period_month',$month)->value('used') ?? 0;
    return $used < (int)$plan->monthly_simulacros_limit;
  }

  public static function increaseSimulacroUsage(int $userId): void {
    $month = now()->startOfMonth()->toDateString();
    DB::table('user_simulacro_usage')->updateOrInsert(
      ['user_id'=>$userId,'period_month'=>$month],
      ['used'=>DB::raw('COALESCE(used,0)+1'), 'updated_at'=>now(), 'created_at'=>now()]
    );
  }

  public static function isSubscriber(?int $userId): bool {
    return self::userPlan($userId) !== null;
  }
}
