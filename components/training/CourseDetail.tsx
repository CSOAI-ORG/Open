                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Status</p>
                      <p className="font-semibold capitalize">{enrollment.status.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Progress</p>
                      <p className="font-semibold">{enrollment.progress || 0}%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Show pricing options only for non-enrolled users */}
              {!isEnrolled && !course.isFree && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Payment Plans</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <input
                        type="radio"
                        value="one_time"
                        checked={selectedPaymentType === "one_time"}
                        onChange={(e) => setSelectedPaymentType(e.target.value as any)}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-semibold">One-Time Payment</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">£{(course.pricing.oneTime / 100).toFixed(2)}</p>
                      </div>
                    </label>
                    
                    {course.pricing.threeMonth && (
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                        <input
                          type="radio"
                          value="3_month"
                          checked={selectedPaymentType === "3_month"}
                          onChange={(e) => setSelectedPaymentType(e.target.value as any)}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-semibold">3-Month Plan</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">£{(course.pricing.threeMonth / 100).toFixed(2)}/month</p>
                        </div>
                      </label>
                    )}
                    
                    {course.pricing.sixMonth && (
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                        <input
                          type="radio"
                          value="6_month"
                          checked={selectedPaymentType === "6_month"}
                          onChange={(e) => setSelectedPaymentType(e.target.value as any)}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-semibold">6-Month Plan</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">£{(course.pricing.sixMonth / 100).toFixed(2)}/month</p>
                        </div>
                      </label>
                    )}
                    
                    {course.pricing.twelveMonth && (
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                        <input
                          type="radio"
                          value="12_month"
                          checked={selectedPaymentType === "12_month"}
                          onChange={(e) => setSelectedPaymentType(e.target.value as any)}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-semibold">12-Month Plan</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">£{(course.pricing.twelveMonth / 100).toFixed(2)}/month</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
